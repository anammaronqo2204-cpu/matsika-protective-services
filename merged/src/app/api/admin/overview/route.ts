import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, candidates, leads, vacancies } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { requireAdmin } from "@/lib/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    await ensureSeeded();

    const statusCounts = await db
      .select({ status: candidates.status, count: sql<number>`count(*)::int` })
      .from(candidates)
      .groupBy(candidates.status);

    const gradeCounts = await db
      .select({ grade: candidates.psiraGrade, count: sql<number>`count(*)::int` })
      .from(candidates)
      .groupBy(candidates.psiraGrade);

    const provinceCounts = await db
      .select({ province: candidates.province, count: sql<number>`count(*)::int` })
      .from(candidates)
      .groupBy(candidates.province)
      .orderBy(sql`count(*) desc`);

    const leadCounts = await db
      .select({ status: leads.status, count: sql<number>`count(*)::int` })
      .from(leads)
      .groupBy(leads.status);

    const [totals] = await db
      .select({
        total: sql<number>`count(*)::int`,
        last7: sql<number>`count(*) filter (where ${candidates.createdAt} > now() - interval '7 days')::int`,
        notifyOptIn: sql<number>`count(*) filter (where ${candidates.notifyEnabled})::int`,
        avgExperience: sql<number>`coalesce(round(avg(${candidates.yearsExperience}))::int, 0)`,
      })
      .from(candidates);

    const [vacancyTotals] = await db
      .select({
        open: sql<number>`count(*) filter (where ${vacancies.isOpen})::int`,
        positions: sql<number>`coalesce(sum(${vacancies.positions}) filter (where ${vacancies.isOpen}), 0)::int`,
      })
      .from(vacancies);

    const recentAudit = await db
      .select()
      .from(auditLog)
      .orderBy(desc(auditLog.createdAt))
      .limit(12);

    const recentCandidates = await db
      .select({
        id: candidates.id,
        refNumber: candidates.refNumber,
        fullName: candidates.fullName,
        status: candidates.status,
        province: candidates.province,
        psiraGrade: candidates.psiraGrade,
        createdAt: candidates.createdAt,
      })
      .from(candidates)
      .orderBy(desc(candidates.createdAt))
      .limit(6);

    const recentLeads = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5);

    return Response.json({
      ok: true,
      overview: {
        totals: totals ?? { total: 0, last7: 0, notifyOptIn: 0, avgExperience: 0 },
        vacancyTotals: vacancyTotals ?? { open: 0, positions: 0 },
        statusCounts,
        gradeCounts,
        provinceCounts,
        leadCounts,
        recentAudit: recentAudit.map((a) => ({
          id: a.id,
          actor: a.actor,
          action: a.action,
          detail: a.detail ?? "",
          createdAt: a.createdAt.toISOString(),
        })),
        recentCandidates: recentCandidates.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        })),
        recentLeads: recentLeads.map((l) => ({
          id: l.id,
          reference: l.reference,
          name: l.name,
          company: l.company ?? "",
          service: l.service ?? "",
          status: l.status,
          urgency: l.urgency ?? "Standard",
          createdAt: l.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("overview failed", error);
    return Response.json({ ok: false, error: "Could not load dashboard." }, { status: 500 });
  }
}
