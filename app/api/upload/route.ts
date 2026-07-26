import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------------------------------------------------------------------
// P2: MIME type + extension allowlist
// NOTE: client-side <input accept="..."> filters are NOT a security control.
// This server-side check is the real enforcement point.
// ---------------------------------------------------------------------------
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png":  [".png"],
  "image/webp": [".webp"],
  "image/gif":  [".gif"],
};

const ALL_ALLOWED_EXTENSIONS = Object.values(ALLOWED_MIME_TYPES).flat();

// Hard file size limit: 10 MB
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

// ---------------------------------------------------------------------------
// In-memory rate limiters (per IP, sliding window)
// SECURITY TODO: replace with Upstash Ratelimit if this service becomes
// stateless/multi-instance — in-memory state is lost on cold starts.
// ---------------------------------------------------------------------------

// POST /api/upload — admin-only upload (10 req/min)
const uploadRateLimit = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

// GET /api/upload — public portfolio fetch (60 req/min)
const getRateLimit = new Map<string, { count: number; windowStart: number }>();
const GET_RATE_LIMIT_MAX = 60;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = uploadRateLimit.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    uploadRateLimit.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) return true;

  entry.count++;
  return false;
}

// ---------------------------------------------------------------------------
// GET — public, returns portfolio items
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  // Rate limit: 60 requests/min per IP to protect Cloudinary Search API usage
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  const entry = getRateLimit.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    getRateLimit.set(ip, { count: 1, windowStart: now });
  } else if (entry.count >= GET_RATE_LIMIT_MAX) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  } else {
    entry.count++;
  }

  try {
    const result = await cloudinary.search
      .expression("resource_type:image OR resource_type:video")
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute();

    const items = result.resources.map((r: any) => ({
      id: r.public_id,
      src: r.secure_url,
      name: (r.filename || r.public_id.split("/").pop()).replace(/[-_]/g, " "),
      type: r.resource_type === "video" ? "video" : r.format === "gif" ? "gif" : "image",
    }));

    return NextResponse.json(items, {
      headers: {
        // Cache portfolio list for 60 s in browser + Vercel edge cache.
        // Reduces Cloudinary Search API calls on repeated loads.
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// ---------------------------------------------------------------------------
// POST — admin only; hardened with auth, validation, rate limiting
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // ── 1. Server-side session check (Google OAuth via NextAuth) ─────────────
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Rate limiting ─────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // ── 3. Hard file size check BEFORE buffering ─────────────────────────────
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ── 4. Double-check size after buffering (guards against missing header) ─
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    // ── 5. MIME type validation ──────────────────────────────────────────────
    const mimeType = file.type;
    if (!(mimeType in ALLOWED_MIME_TYPES)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
    }

    // ── 6. File extension validation ─────────────────────────────────────────
    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = ALL_ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext)
    );
    if (!hasAllowedExtension) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
    }

    // ── 7. Extension must match declared MIME type ───────────────────────────
    const mimeAllowedExtensions = ALLOWED_MIME_TYPES[mimeType];
    const extensionMatchesMime = mimeAllowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );
    if (!extensionMatchesMime) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
    }

    // ── 8. Upload to Cloudinary ──────────────────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder: "jinzuuvisuals",
        resource_type: "image", // images only; resource_type:auto removed for safety
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      };

      if (title) {
        uploadOptions.public_id = title.replace(/\s+/g, "-").toLowerCase();
      }

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json(result);
  } catch (error) {
    // Never expose internal error details to the client
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}