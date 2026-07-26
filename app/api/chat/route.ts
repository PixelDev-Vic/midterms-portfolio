import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy-key-build-pass",
});

const SYSTEM_PROMPT = `You are the AI assistant for JinzuuVisuals, a creative space run by an aspiring visual artist. You are extremely friendly, helpful, and supportive of small budgets and big dreams.

You ONLY answer questions about JinzuuVisuals. If asked anything outside of this scope, politely redirect the conversation.

## About JinzuuVisuals
JinzuuVisuals is a startup creative studio based in the Philippines. We specialize in helping small brands, students, and content creators get high-quality visuals without the agency price tag. We believe great design should be accessible to everyone starting their journey.

## Services & Pricing (PHP)
- **Basic Branding Kit** — Essential logo design (2 concepts) and a simple color palette. Starting at ₱3,500.
- **Digital Illustration** — Hand-drawn portraits, character art, or icons. Starting at ₱500 - ₱1,500 per piece (depending on detail).
- **Motion Graphics** — Basic 5-10 second logo animations or simple video intros. Starting at ₱2,500.
- **Social Media Pack** — A "Starter Pack" of 5 custom-designed templates or posts for your page. Starting at ₱3,000.
- **Custom Commissions** — Budget-friendly options available! If you have a specific budget in mind, don't be shy to ask.

## Portfolio & Style
JinzuuVisuals is currently building its portfolio, so we are very open to different styles—from "aesthetic" minimalist to fun and colorful illustrations.

## Contact & Availability
- Email: pascua.victor0408@gmail.com
- Response time: Fast! Usually within a few hours.
- Open for commissions: Yes! Slots are available for this week.
- Message us through the contact form for a "kaibigan" discount for first-time clients.

## Process
1. **Quick Chat:** Tell us your idea and your budget.
2. **First Draft:** We'll send a rough sketch or concept for your approval.
3. **Revisions:** 3 rounds of edits are included for free!
4. **Turn-over:** Clean files sent via GDrive.

## Response Style
- Sound like a helpful peer or "kapatid." Use a light, encouraging tone.
- Use friendly emojis: ✨ 🎨 👋 🇵🇭
- If someone says it's still too expensive, say: "No worries! We can simplify the design or do a 'lite' version to fit what you can afford right now."
- Keep your AI nature a secret—you are the studio's friendly assistant.`;

// ---------------------------------------------------------------------------
// In-memory rate limiter (per IP, sliding window — Node Runtime)
//
// Current limits:
//   • RATE_LIMIT_MAX_REQUESTS = 20 requests per RATE_LIMIT_WINDOW_MS = 60 000 ms
//   • Stale entries are evicted after 2× the window (CLEANUP_AFTER_MS) to
//     prevent unbounded memory growth on high-traffic deployments.
//
// How to tune:
//   • Lower RATE_LIMIT_MAX_REQUESTS (e.g. 10) for tighter abuse prevention.
//   • Raise RATE_LIMIT_WINDOW_MS (e.g. 300_000) to enforce a 5-minute cooldown.
//   • For multi-instance / serverless deployments replace this Map with
//     Upstash Ratelimit (https://upstash.com) — in-memory state is lost on
//     cold starts and is not shared across instances.
//
// Provider spend alerts:
//   • This code limits request *count* but cannot cap token spend directly.
//   • You MUST set a hard monthly spend limit and email alert in your
//     OpenRouter dashboard: https://openrouter.ai/settings/billing
// ---------------------------------------------------------------------------
const chatRateLimit = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;   // 1 minute sliding window
const RATE_LIMIT_MAX_REQUESTS = 20;    // max requests per IP per window
const CLEANUP_AFTER_MS = RATE_LIMIT_WINDOW_MS * 2; // evict stale entries after 2× window

function isRateLimited(ip: string): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Evict stale entries to prevent memory growth
  // Array.from() wrapper avoids --downlevelIteration requirement (tsconfig has no explicit target)
  for (const [key, val] of Array.from(chatRateLimit.entries())) {
    if (now - val.windowStart > CLEANUP_AFTER_MS) {
      chatRateLimit.delete(key);
    }
  }

  const entry = chatRateLimit.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    chatRateLimit.set(ip, { count: 1, windowStart: now });
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil(
      (RATE_LIMIT_WINDOW_MS - (now - entry.windowStart)) / 1000
    );
    return { limited: true, retryAfterSeconds };
  }

  entry.count++;
  return { limited: false, retryAfterSeconds: 0 };
}

// Max stringified messages payload (8 000 characters)
const MAX_MESSAGES_CHARS = 8_000;
// Request body size limit: 32 KB
const MAX_BODY_BYTES = 32 * 1024;
// Max messages allowed per request
const MAX_MESSAGES = 50;

export async function POST(req: NextRequest): Promise<NextResponse | Response> {
  // ── 1. Rate limiting ─────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const { limited, retryAfterSeconds } = isRateLimited(ip);
  if (limited) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      }
    );
  }

  // ── 2. Request body size limit ───────────────────────────────────────────
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request failed" }, { status: 413 });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    // ── 3. Max message count ─────────────────────────────────────────────────
    if (!Array.isArray(messages) || messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: "Request failed" }, { status: 400 });
    }

    // ── 4. Prompt size cap ───────────────────────────────────────────────────
    // Guards against large payloads that slip past the Content-Length check
    // (e.g. chunked transfer encoding) and prevents runaway token spend.
    const messagesCharCount = JSON.stringify(messages).length;
    if (messagesCharCount > MAX_MESSAGES_CHARS) {
      return NextResponse.json(
        { error: "Request too large." },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not configured");
      return NextResponse.json({ error: "Request failed" }, { status: 500 });
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();
        } catch (err) {
          // Log full details server-side only — never leak to client
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    // Log full details server-side only — never expose error.message or stack to client
    console.error("Chat route error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
