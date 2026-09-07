import { and, asc, desc, eq, gte, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { candidateDocuments, candidates } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { requireAdmin } from "@/lib/guard";
import type { AdminCandidateRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    await ensureSeeded();
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const grade = url.searchParams.get("grade") ?? "";
    const province = url.searchParams.get("province") ?? "";
    const psiraStatus = url.searchParams.get("psiraStatus") ?? "";
    const availability = url.searchParams.get("availability") ?? "";
    const shift = url.searchParams.get("shift") ?? "";
    const minExperience = url.searchParams.get("minExperience") ?? "";
    const applicationStatus = url.searchParams.get("applicationStatus") ?? "";
    const documentStatus = url.searchParams.get("documentStatus") ?? "";
    const sortKey = url.searchParams.get("sortKey") ?? "createdAt";
    const sortDir = url.searchParams.get("sortDir") === "asc" ? "asc" : "desc";

    const conditions: SQL[] = [];
    if (q) {
      const like = `%${q.toLowerCase()}%`;
      conditions.push(
        sql`(lower(${candidates.fullName}) like ${like} or lower(${candidates.refNumber}) like ${like} or lower(${candidates.city}) like ${like} or lower(${candidates.province}) like ${like} or lower(${candidates.psiraNumber}) like ${like} or lower(${candidates.email}) like ${like})`,
      );
    }
    if (grade) conditions.push(eq(candidates.psiraGrade, grade));
    if (province) conditions.push(eq(candidates.province, province));
    if (psiraStatus) conditions.push(eq(candidates.psiraStatus, psiraStatus));
    if (availability) conditions.push(eq(candidates.availability, availability));
    if (shift) conditions.push(eq(candidates.shift, shift));
    if (minExperience) conditions.push(gte(candidates.yearsExperience, Number(minExperience) || 0));
    if (applicationStatus) conditions.push(eq(candidates.status, applicationStatus));
    if (documentStatus) {
      conditions.push(
        sql`exists (select 1 from ${candidateDocuments} d where d.candidate_id = ${candidates.id} and d.status = ${documentStatus})`,
      );
    }

    const sortColumn =
      sortKey === "name"
        ? candidates.fullName
        : sortKey === "location"
          ? candidates.city
          : sortKey === "grade"
            ? candidates.psiraGrade
            : sortKey === "experience"
              ? candidates.yearsExperience
              : sortKey === "status"
                ? candidates.status
                : candidates.createdAt;

    const rows = await db
      .select()
      .from(candidates)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(sortDir === "asc" ? asc(sortColumn) : desc(sortColumn))
      .limit(500);

    const [totalRow] = await db.select({ count: sql<number>`count(*)::int` }).from(candidates);

    const data: AdminCandidateRow[] = rows.map((c) => ({
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
    }));

    return Response.json({ ok: true, candidates: data, total: totalRow?.count ?? data.length });
  } catch (error) {
    console.error("candidate list failed", error);
    return Response.json({ ok: false, error: "Could not load candidates." }, { status: 500 });
  }
}
