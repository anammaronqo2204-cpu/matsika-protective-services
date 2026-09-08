import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { auditLogs, candidates, contactMessages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-api";
import { rowToCandidate } from "@/lib/serialize";

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [rows, logs, msgs] = await Promise.all([
    db.select().from(candidates).orderBy(desc(candidates.createdAt)),
    db.select().from(auditLogs).orderBy(desc(auditLogs.ts)).limit(60),
    db.select({ id: contactMessages.id }).from(contactMessages).where(eq(contactMessages.handled, false)),
  ]);

  return NextResponse.json({
    candidates: rows.map(rowToCandidate),
    auditLog: logs.map((l) => ({
      ts: l.ts.toISOString(),
      actor: l.actor,
      action: l.action,
      detail: l.detail,
    })),
    unreadMessages: msgs.length,
  });
}
