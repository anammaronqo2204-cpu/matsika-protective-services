import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET || "mps-dev-secret-change-before-prod";

const COOKIE_NAME = "mps_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return test.length === expected.length && timingSafeEqual(test, expected);
}

export function signSessionToken(username: string): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${username}.${exp}`;
  const sig = createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 32);
  return `${payload}.${sig}`;
}

export function verifySessionToken(
  token: string | null | undefined
): { username: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [username, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!exp || !Number.isFinite(exp) || exp < Date.now()) return null;
  const expected = createHmac("sha256", SECRET)
    .update(`${username}.${exp}`)
    .digest("hex")
    .slice(0, 32);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? { username } : null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export { COOKIE_NAME };
