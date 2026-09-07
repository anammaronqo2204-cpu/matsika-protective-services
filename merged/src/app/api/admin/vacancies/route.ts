import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, vacancies } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { forbidden, requireAdmin } from "@/lib/guard";
import { ROLES } from "@/lib/constants";
import type { VacancyRow } from "@/lib/types";

export const dynamic = "force-dynamic";

function canEdit(role: string) {
  return role === ROLES.SUPER || role === ROLES.RECRUITER;
}

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    await ensureSeeded();
    const rows = await db.select().from(vacancies).orderBy(desc(vacancies.postedAt));
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
    console.error("vacancy list failed", error);
    return Response.json({ ok: false, error: "Could not load vacancies." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  if (!canEdit(guard.user.role)) return forbidden();

  try {
    const body = (await request.json()) as Partial<VacancyRow> & { requirementsText?: string };
    if (!body.title) {
      return Response.json({ ok: false, error: "Title is required." }, { status: 400 });
    }
    const requirements = (body.requirementsText ?? "")
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const [inserted] = await db
      .insert(vacancies)
      .values({
        code: body.code ?? "",
        title: body.title,
        location: body.location ?? "",
        province: body.province ?? "",
        grade: body.grade ?? "C",
        shift: body.shift ?? "Both",
        employmentType: body.employmentType ?? "Full-time",
        summary: body.summary ?? "",
        requirements,
        positions: Number(body.positions) || 1,
        isOpen: true,
      })
      .returning({ id: vacancies.id });

    if (!body.code) {
      await db
        .update(vacancies)
        .set({ code: "VAC-" + String(inserted.id).padStart(3, "0") })
        .where(eq(vacancies.id, inserted.id));
    }

    await db.insert(auditLog).values({
      actor: guard.user.name,
      action: "Vacancy published",
      detail: body.title,
    });
    return Response.json({ ok: true, id: inserted.id });
  } catch (error) {
    console.error("vacancy create failed", error);
    return Response.json({ ok: false, error: "Could not create vacancy." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  if (!canEdit(guard.user.role)) return forbidden();

  try {
    const { id, isOpen } = (await request.json()) as { id?: number; isOpen?: boolean };
    if (!id || typeof isOpen !== "boolean") {
      return Response.json({ ok: false, error: "id and isOpen required." }, { status: 400 });
    }
    await db.update(vacancies).set({ isOpen }).where(eq(vacancies.id, id));
    await db.insert(auditLog).values({
      actor: guard.user.name,
      action: isOpen ? "Vacancy re-opened" : "Vacancy closed",
      detail: `Vacancy #${id}`,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("vacancy update failed", error);
    return Response.json({ ok: false, error: "Could not update vacancy." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  if (guard.user.role !== ROLES.SUPER) return forbidden();

  try {
    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id")) || 0;
    if (!id) return Response.json({ ok: false, error: "id required." }, { status: 400 });
    await db.delete(vacancies).where(eq(vacancies.id, id));
    await db
      .insert(auditLog)
      .values({ actor: guard.user.name, action: "Vacancy deleted", detail: `Vacancy #${id}` });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("vacancy delete failed", error);
    return Response.json({ ok: false, error: "Could not delete vacancy." }, { status: 500 });
  }
}
