import { NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs, candidates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { candidateToRow, rowToCandidate, type AppCandidate } from "@/lib/serialize";

function requiredFields(c: AppCandidate): string | null {
  const p = c.personal;
  if (!p.fullName?.trim()) return "Full name is required.";
  if (!p.idNumber?.trim()) return "ID / passport number is required.";
  if (!p.mobile?.trim()) return "Mobile number is required.";
  if (!p.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return "A valid email is required.";
  if (!p.province) return "Province is required.";
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cand = body?.candidate as AppCandidate | undefined;
    if (!cand) {
      return NextResponse.json({ error: "No application data received." }, { status: 400 });
    }
    const invalid = requiredFields(cand);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });
    if (!cand.consent?.agreed) {
      return NextResponse.json(
        { error: "POPIA consent is required to submit an application." },
        { status: 400 }
      );
    }

    const now = new Date();
    const appCandidate: AppCandidate = {
      ...cand,
      consent: { agreed: true, timestamp: now.toISOString() },
      status: "New",
      statusHistory: [
        { status: "New", timestamp: now.toISOString(), by: "System" },
      ],
      internalNotes: [],
    };

    const result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(candidates)
        .values({
          ...candidateToRow(appCandidate),
          refNumber: `TMP-${crypto.randomUUID()}`,
          consentTimestamp: now,
        })
        .returning({ id: candidates.id, seq: candidates.seq });

      const row = inserted[0];
      const refNumber = `MPS-${String(row.seq).padStart(6, "0")}`;
      await tx
        .update(candidates)
        .set({ refNumber })
        .where(eq(candidates.id, row.id));

      await tx.insert(auditLogs).values({
        actor: appCandidate.personal.fullName,
        action: "Application submitted",
        detail: refNumber,
      });

      const fresh = await tx.select().from(candidates).where(eq(candidates.id, row.id));
      return { refNumber, fresh: fresh[0] };
    });

    return NextResponse.json({
      refNumber: result.refNumber,
      candidate: rowToCandidate(result.fresh),
    });
  } catch (e) {
    console.error("POST /api/candidates failed", e);
    return NextResponse.json({ error: "Could not save your application." }, { status: 500 });
  }
}
