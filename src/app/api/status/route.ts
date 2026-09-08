import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidates } from "@/db/schema";
import { sql } from "drizzle-orm";
import { DOC_TYPES, PUBLIC_STATUS_LABEL, STATUS_COLORS } from "@/lib/constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = (searchParams.get("ref") || "").trim().toLowerCase();
  const id = (searchParams.get("id") || "").trim().toLowerCase();

  if (!ref || !id) {
    return NextResponse.json(
      { error: "Reference number and ID / passport number are both required." },
      { status: 400 }
    );
  }

  const row = await db
    .select()
    .from(candidates)
    .where(sql`lower(${candidates.refNumber}) = lower(${ref})`)
    .limit(1);

  const cand = row[0];
  if (!cand || !cand.idNumber.toLowerCase().includes(id)) {
    return NextResponse.json(
      { error: "No application found for that reference and ID combination." },
      { status: 404 }
    );
  }

  const docs = cand.documents || {};
  return NextResponse.json({
    refNumber: cand.refNumber,
    fullName: cand.fullName,
    createdAt: cand.createdAt.toISOString(),
    province: cand.province,
    status: cand.status,
    statusLabel: PUBLIC_STATUS_LABEL[cand.status] || cand.status,
    statusColor: STATUS_COLORS[cand.status] || "#C9A227",
    documents: DOC_TYPES.map((d) => ({
      key: d.key,
      label: d.label,
      status: docs[d.key]?.status || "Missing",
    })),
    history: (cand.statusHistory || []).map((h) => ({
      status: h.status,
      label: PUBLIC_STATUS_LABEL[h.status] || h.status,
      timestamp: h.timestamp,
    })),
  });
}
