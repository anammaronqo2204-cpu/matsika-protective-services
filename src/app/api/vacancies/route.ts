import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import type { VacancyRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(vacancies)
      .where(eq(vacancies.isOpen, true))
      .orderBy(desc(vacancies.postedAt));

    const data: VacancyRow[] = rows.map((v) => ({
      id: v.id,
      code: v.code,
      title: v.title,
      location: v.location,
      province: v.province,
      grade: v.grade,
      shift: v.shift,
      employmentType: v.employmentType,
      summary: v.summary,
      requirements: v.requirements ?? [],
      positions: v.positions,
      isOpen: v.isOpen,
      postedAt: v.postedAt.toISOString(),
    }));

    return Response.json({ ok: true, vacancies: data });
  } catch (error) {
    console.error("vacancy fetch failed", error);
    return Response.json({ ok: false, vacancies: [] }, { status: 500 });
  }
}
