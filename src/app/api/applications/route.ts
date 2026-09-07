import { sql } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, candidateDocuments, candidates, statusHistory } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { DOC_TYPES } from "@/lib/constants";
import { refNumber } from "@/lib/format";
import type { ApplicationPayload } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const payload = (await request.json()) as ApplicationPayload;

    const p = payload.personal;
    if (!p?.fullName || !p?.idNumber || !p?.mobile || !p?.email || !p?.province) {
      return Response.json(
        { ok: false, error: "Missing required personal details." },
        { status: 400 },
      );
    }
    if (!payload.consent?.agreed) {
      return Response.json(
        { ok: false, error: "POPIA consent is required before submitting." },
        { status: 400 },
      );
    }

    const now = new Date();
    const [inserted] = await db
      .insert(candidates)
      .values({
        fullName: p.fullName.trim(),
        idNumber: p.idNumber.trim(),
        dob: p.dob ?? "",
        gender: p.gender ?? "",
        mobile: p.mobile.trim(),
        email: p.email.trim().toLowerCase(),
        address: p.address ?? "",
        city: p.city ?? "",
        province: p.province,
        preferredAreas: p.preferredAreas ?? "",
        psiraNumber: payload.security?.psiraNumber ?? "",
        psiraGrade: payload.security?.psiraGrade || "Not yet registered",
        psiraStatus: payload.security?.psiraStatus || "Not yet verified",
        yearsExperience: Number(payload.security?.yearsExperience || 0) || 0,
        previousEmployer: payload.security?.previousEmployer ?? "",
        previousSites: payload.security?.previousSites ?? "",
        referenceDetails: payload.security?.referenceDetails ?? "",
        qualifications: (payload.training?.qualifications ?? []).filter((q) => q.type || q.provider),
        firstAid: Boolean(payload.training?.firstAid),
        firefighting: Boolean(payload.training?.firefighting),
        otherTraining: payload.training?.other ?? "",
        availability: payload.availability?.availability || "Immediately",
        shift: payload.availability?.shift || "Both",
        employmentType: payload.availability?.employmentType || "Full-time",
        preferredLocations: payload.availability?.preferredLocations ?? "",
        appliedForVacancy: payload.availability?.appliedForVacancy ?? "",
        consentAgreed: true,
        consentAt: now,
        notifyEnabled: Boolean(payload.notify?.enabled),
        notifyGrade: payload.notify?.grade ?? "",
        notifyLocation: payload.notify?.location ?? "",
        notifyShift: payload.notify?.shift ?? "",
        notifyEmploymentType: payload.notify?.employmentType ?? "",
        status: "New",
        isDemo: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: candidates.id, seq: candidates.seq });

    const ref = refNumber(inserted.seq);
    await db
      .update(candidates)
      .set({ refNumber: ref })
      .where(sql`${candidates.id} = ${inserted.id}`);

    const docRows = DOC_TYPES.map((t) => {
      const doc = payload.documents?.[t.key] ?? null;
      const tooBig = doc ? doc.size > MAX_FILE_BYTES : false;
      return {
        candidateId: inserted.id,
        docKey: t.key,
        status: doc ? "Uploaded" : "Missing",
        filename: doc?.filename ?? null,
        mimeType: doc?.mimeType ?? null,
        sizeBytes: doc?.size ?? 0,
        dataBase64: doc && !tooBig ? doc.dataBase64 : null,
        uploadedAt: doc ? now : null,
      };
    });
    await db.insert(candidateDocuments).values(docRows);

    await db.insert(statusHistory).values({
      candidateId: inserted.id,
      status: "New",
      changedBy: "Candidate portal",
      createdAt: now,
    });

    await db.insert(auditLog).values({
      actor: p.fullName.trim(),
      action: "Application submitted",
      detail: `${ref} · ${p.province}`,
    });

    return Response.json({ ok: true, refNumber: ref });
  } catch (error) {
    console.error("application submit failed", error);
    return Response.json(
      { ok: false, error: "We could not submit your application. Please try again." },
      { status: 500 },
    );
  }
}
