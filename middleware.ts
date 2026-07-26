import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Edge Middleware — server-side route protection.
 *
 * Uses NextAuth JWT token validation. The token is set by Google OAuth via
 * next-auth. Only accounts whitelisted in ADMIN_EMAIL can obtain a token.
 *
 * Defence-in-depth: admin pages also call getServerSession() server-side,
 * so a middleware bypass still cannot render protected content.
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    // Preserve the original destination so the login page can redirect back
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // "/admin"        — guards the bare /admin index page
  // "/admin/:path*" — guards every nested route under /admin/
  matcher: ["/admin", "/admin/:path*"],
};
