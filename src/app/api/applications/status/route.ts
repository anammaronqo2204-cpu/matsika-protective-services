import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { candidateDocuments, candidates, statusHistory } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { DOC_TYPES, PUBLIC_STATUS_LABEL } from "@/lib/constants";
import type { PublicStatusResult } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const { reference, idNumber } = (await request.json()) as {
      reference?: string;
      idNumber?: string;
    };

    if (!reference || !idNumber) {
      return Response.json(
        { ok: false, error: "Reference and ID/passport number are required." },
        { status: 400 },
      );
    }

    const rows = await db
      .select()
      .from(candidates)
      .where(
        and(
          sql`lower(${candidates.refNumber}) = ${reference.trim().toLowerCase()}`,
          sql`lower(${candidates.idNumber}) = ${idNumber.trim().toLowerCase()}`,
        ),
      )
      .limit(1);

    if (rows.length === 0) {
      return Response.json(
        {
          ok: false,
          error:
            "No application matches that reference and ID/passport number combination.",
        },
        { status: 404 },
      );
    }

    const cand = rows[0];
    const docs = await db
      .select()
      .from(candidateDocuments)
      .where(eq(candidateDocuments.candidateId, cand.id));
    const history = await db
      .select()
      .from(statusHistory)
      .where(eq(statusHistory.candidateId, cand.id))
      .orderBy(asc(statusHistory.createdAt));

    const result: PublicStatusResult = {
      refNumber: cand.refNumber,
      fullName: cand.fullName,
      province: cand.province ?? "",
      createdAt: cand.createdAt.toISOString(),
      status: cand.status,
      publicStatus: PUBLIC_STATUS_LABEL[cand.status] ?? cand.status,
      documents: DOC_TYPES.map((t) => ({
        key: t.key,
        label: t.label,
        status: docs.find((d) => d.docKey === t.key)?.status ?? "Missing",
      })),
      history: history.map((h) => ({
        status: h.status,
        publicStatus: PUBLIC_STATUS_LABEL[h.status] ?? h.status,
        createdAt: h.createdAt.toISOString(),
      })),
    };

    return Response.json({ ok: true, result });
  } catch (error) {
    console.error("status lookup failed", error);
    return Response.json({ ok: false, error: "Lookup failed. Please try again." }, { status: 500 });
  }
}
