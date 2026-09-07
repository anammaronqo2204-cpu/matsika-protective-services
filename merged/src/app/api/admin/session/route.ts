import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers, auditLog } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import {
  SESSION_COOKIE,
  createSessionToken,
  getSession,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSession();
  if (!user) return Response.json({ ok: false, user: null }, { status: 200 });
  return Response.json({
    ok: true,
    user: { id: user.id, username: user.username, name: user.name, role: user.role },
  });
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      return Response.json({ ok: false, error: "Enter a username and password." }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username.trim().toLowerCase()))
      .limit(1);

    const user = rows[0];
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return Response.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
    }

    const token = createSessionToken({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });
    const store = await cookies();
    store.set(SESSION_COOKIE, token, sessionCookieOptions);

    await db.insert(auditLog).values({
      actor: user.name,
      action: "Administrator signed in",
      detail: user.role,
    });

    return Response.json({
      ok: true,
      user: { id: user.id, username: user.username, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("login failed", error);
    return Response.json({ ok: false, error: "Sign in failed. Try again." }, { status: 500 });
  }
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
