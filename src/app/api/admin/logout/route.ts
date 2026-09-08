import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, sessionCookieOptions } from "@/lib/auth";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { ...sessionCookieOptions(), maxAge: 0 });
  return res;
}
