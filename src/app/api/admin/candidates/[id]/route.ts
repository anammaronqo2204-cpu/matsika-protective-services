import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  auditLog,
  candidateDocuments,
  candidates,
  internalNotes,
  statusHistory,
} from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { forbidden, requireAdmin } from "@/lib/guard";
import {
  DOC_TYPES,
  ROLE_CAN_ADD_NOTES,
  ROLE_CAN_EDIT_DOCS,
  ROLE_CAN_EDIT_STATUS,
} from "@/lib/constants";
import type { AdminCandidateDetail } from "@/lib/types";

export const dynamic = "force-dynamic";

async function loadDetail(id: string): Promise<AdminCandidateDetail | null> {
  const rows = await db.select().from(candidates).where(eq(candidates.id, id)).limit(1);
  const c = rows[0];
  if (!c) return null;

  const docs = await db
    .select()
    .from(candidateDocuments)
    .where(eq(candidateDocuments.candidateId, id));
  const history = await db
    .select()
    .from(statusHistory)
    .where(eq(statusHistory.candidateId, id))
    .orderBy(asc(statusHistory.createdAt));
  const notes = await db
    .select()
    .from(internalNotes)
    .where(eq(internalNotes.candidateId, id))
    .orderBy(desc(internalNotes.createdAt));

  return {
    id: c.id,
    refNumber: c.refNumber,
    fullName: c.fullName,
    email: c.email ?? "",
    mobile: c.mobile ?? "",
    city: c.city ?? "",
    province: c.province ?? "",
    psiraGrade: c.psiraGrade ?? "",
    psiraStatus: c.psiraStatus ?? "",
    yearsExperience: c.yearsExperience ?? 0,
    availability: c.availability ?? "",
    shift: c.shift ?? "",
    employmentType: c.employmentType ?? "",
    status: c.status,
    isDemo: c.isDemo,
    createdAt: c.createdAt.toISOString(),
    idNumber: c.idNumber,
    dob: c.dob ?? "",
    gender: c.gender ?? "",
    address: c.address ?? "",
    preferredAreas: c.preferredAreas ?? "",
    psiraNumber: c.psiraNumber ?? "",
    previousEmployer: c.previousEmployer ?? "",
    previousSites: c.previousSites ?? "",
    referenceDetails: c.referenceDetails ?? "",
    qualifications: c.qualifications ?? [],
    firstAid: c.firstAid,
    firefighting: c.firefighting,
    otherTraining: c.otherTraining ?? "",
    preferredLocations: c.preferredLocations ?? "",
    appliedForVacancy: c.appliedForVacancy ?? "",
    consentAgreed: c.consentAgreed,
    consentAt: c.consentAt ? c.consentAt.toISOString() : null,
    notifyEnabled: c.notifyEnabled,
    notifyGrade: c.notifyGrade ?? "",
    notifyLocation: c.notifyLocation ?? "",
    notifyShift: c.notifyShift ?? "",
    notifyEmploymentType: c.notifyEmploymentType ?? "",
    documents: DOC_TYPES.map((t) => {
      const d = docs.find((row) => row.docKey === t.key);
      return {
        id: d?.id ?? 0,
        docKey: t.key,
        status: d?.status ?? "Missing",
        filename: d?.filename ?? null,
        mimeType: d?.mimeType ?? null,
        sizeBytes: d?.sizeBytes ?? 0,
        hasFile: Boolean(d?.dataBase64),
        uploadedAt: d?.uploadedAt ? d.uploadedAt.toISOString() : null,
      };
    }),
    history: history.map((h) => ({
      status: h.status,
      changedBy: h.changedBy,
      createdAt: h.createdAt.toISOString(),
    })),
    notes: notes.map((n) => ({
      id: n.id,
      body: n.body,
      author: n.author,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    await ensureSeeded();
    const { id } = await ctx.params;
    const detail = await loadDetail(id);
    if (!detail) {
      return Response.json({ ok: false, error: "Candidate not found." }, { status: 404 });
    }
    return Response.json({ ok: true, candidate: detail });
  } catch (error) {
    console.error("candidate detail failed", error);
    return Response.json({ ok: false, error: "Could not load candidate." }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const user = guard.user;

  try {
    await ensureSeeded();
    const { id } = await ctx.params;
    const body = (await request.json()) as {
      action: string;
      status?: string;
      docKey?: string;
      note?: string;
      psiraStatus?: string;
    };

    const existing = await db
      .select({ id: candidates.id, refNumber: candidates.refNumber })
      .from(candidates)
      .where(eq(candidates.id, id))
      .limit(1);
    if (existing.length === 0) {
      return Response.json({ ok: false, error: "Candidate not found." }, { status: 404 });
    }
    const ref = existing[0].refNumber;

    if (body.action === "status") {
      if (!ROLE_CAN_EDIT_STATUS[user.role]) return forbidden();
      if (!body.status) {
        return Response.json({ ok: false, error: "Status is required." }, { status: 400 });
      }
      await db
        .update(candidates)
        .set({ status: body.status, updatedAt: new Date() })
        .where(eq(candidates.id, id));
      await db
        .insert(statusHistory)
        .values({ candidateId: id, status: body.status, changedBy: user.name });
      await db.insert(auditLog).values({
        actor: user.name,
        action: `Status changed to "${body.status}"`,
        detail: ref,
      });
    } else if (body.action === "document") {
      if (!ROLE_CAN_EDIT_DOCS[user.role]) return forbidden();
      if (!body.docKey || !body.status) {
        return Response.json({ ok: false, error: "Document and status required." }, { status: 400 });
      }
      await db
        .update(candidateDocuments)
        .set({ status: body.status, reviewedAt: new Date() })
        .where(
          and(
            eq(candidateDocuments.candidateId, id),
            eq(candidateDocuments.docKey, body.docKey),
          ),
        );
      const label = DOC_TYPES.find((d) => d.key === body.docKey)?.label ?? body.docKey;
      await db.insert(auditLog).values({
        actor: user.name,
        action: `${label} marked "${body.status}"`,
        detail: ref,
      });
    } else if (body.action === "psira") {
      if (!ROLE_CAN_EDIT_DOCS[user.role]) return forbidden();
      if (!body.psiraStatus) {
        return Response.json({ ok: false, error: "PSiRA status required." }, { status: 400 });
      }
      await db
        .update(candidates)
        .set({ psiraStatus: body.psiraStatus, updatedAt: new Date() })
        .where(eq(candidates.id, id));
      await db.insert(auditLog).values({
        actor: user.name,
        action: `PSiRA verification set to "${body.psiraStatus}"`,
        detail: ref,
      });
    } else if (body.action === "note") {
      if (!ROLE_CAN_ADD_NOTES[user.role]) return forbidden();
      if (!body.note?.trim()) {
        return Response.json({ ok: false, error: "Note cannot be empty." }, { status: 400 });
      }
      await db
        .insert(internalNotes)
        .values({ candidateId: id, body: body.note.trim(), author: user.name });
      await db
        .insert(auditLog)
        .values({ actor: user.name, action: "Internal note added", detail: ref });
    } else {
      return Response.json({ ok: false, error: "Unknown action." }, { status: 400 });
    }

    const detail = await loadDetail(id);
    return Response.json({ ok: true, candidate: detail });
  } catch (error) {
    console.error("candidate update failed", error);
    return Response.json({ ok: false, error: "Could not update candidate." }, { status: 500 });
  }
}
