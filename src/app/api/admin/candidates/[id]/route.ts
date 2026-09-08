import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { auditLogs, candidates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-api";
import { candidateToRow, rowToCandidate, type AppCandidate } from "@/lib/serialize";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const rows = await db.select().from(candidates).where(eq(candidates.id, id)).limit(1);
  if (!rows[0]) return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  return NextResponse.json({ candidate: rowToCandidate(rows[0]) });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  if (user.role === "Read Only") {
    return NextResponse.json({ error: "Your role has read-only access." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const cand = body?.candidate as AppCandidate | undefined;
  if (!cand || cand.id !== id) {
    return NextResponse.json({ error: "Invalid candidate payload." }, { status: 400 });
  }

  const row = candidateToRow(cand);
  const result = await db.transaction(async (tx) => {
    await tx
      .update(candidates)
      .set({
        ...row,
        statusHistory: cand.statusHistory || [],
        internalNotes: cand.internalNotes || [],
        documents: cand.documents || {},
      })
      .where(eq(candidates.id, id));

    const auditAction = typeof body.auditAction === "string" ? body.auditAction : "Candidate updated";
    await tx.insert(auditLogs).values({
      actor: user.name,
      action: auditAction,
      detail: cand.refNumber,
    });

    const fresh = await tx.select().from(candidates).where(eq(candidates.id, id));
    return fresh[0];
  });

  return NextResponse.json({ candidate: rowToCandidate(result) });
}
