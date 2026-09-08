import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sessionCookieOptions, signSessionToken, verifyPassword, COOKIE_NAME } from "@/lib/auth";
import { sessionPublic } from "@/lib/admin-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body?.username || "").trim();
    const password = String(body?.password || "");

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const res = NextResponse.json({ ...sessionPublic(user) });
    res.cookies.set(COOKIE_NAME, signSessionToken(user.username), sessionCookieOptions());
    return res;
  } catch (e) {
    console.error("POST /api/admin/login failed", e);
    return NextResponse.json({ error: "Sign in failed. Please try again." }, { status: 500 });
  }
}
