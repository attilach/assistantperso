import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

// Paths that must remain accessible without auth:
// - login flow itself
// - cron endpoints (own X-Cron-Secret auth)
// - inbox endpoint for external agents (own Bearer token auth)
const PUBLIC_PATH_PREFIXES = ["/login", "/api/login", "/api/logout", "/api/cron/", "/api/messages"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    // Fail closed if misconfigured — better than silently letting through
    return NextResponse.json({ error: "auth not configured" }, { status: 500 });
  }

  const ok = await verifyAuthToken(secret, token);
  if (ok) return NextResponse.next();

  // For API requests, return 401 JSON. For pages, redirect to /login.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", req.url);
  if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // Run on everything except Next internals + static assets
    "/((?!_next/|favicon|icon|apple-icon|manifest.webmanifest|sw.js|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp|woff2?)$).*)",
  ],
};
