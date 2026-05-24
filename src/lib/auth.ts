/**
 * Minimal HMAC-based auth helpers compatible with Edge runtime (middleware).
 * Uses Web Crypto API — no Node-only modules.
 */

const COOKIE_NAME = "assistantperso_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  const bytes = new Uint8Array(sig);
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

/** Constant-time string comparison to avoid timing leaks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function makeAuthToken(secret: string): Promise<string> {
  return hmac(secret, "v1:authenticated");
}

export async function verifyAuthToken(secret: string, token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await hmac(secret, "v1:authenticated");
  return safeEqual(expected, token);
}

export { COOKIE_NAME, COOKIE_MAX_AGE };
