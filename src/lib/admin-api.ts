import type { NextRequest } from "next/server";
import { db } from "@/db";
import { adminUsers, type AdminUserRow } from "@/db/schema";
import { eq } from "drizzle-orm";
import { COOKIE_NAME, verifySessionToken } from "./auth";

export async function requireAdmin(req: NextRequest): Promise<AdminUserRow | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, payload.username))
    .limit(1);
  return rows[0] ?? null;
}

export function sessionPublic(u: AdminUserRow) {
  return {
    username: u.username,
    name: u.name,
    role: u.role,
  };
}
