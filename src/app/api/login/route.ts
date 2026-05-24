import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, COOKIE_MAX_AGE, makeAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { pin } = await req.json().catch(() => ({}));
  const expected = process.env.APP_PIN;
  const secret = process.env.AUTH_SECRET;

  if (!expected || !secret) {
    return NextResponse.json({ error: "auth not configured" }, { status: 500 });
  }
  if (typeof pin !== "string" || pin !== expected) {
    // Small delay to slow down brute force
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "invalid pin" }, { status: 401 });
  }

  const token = await makeAuthToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
