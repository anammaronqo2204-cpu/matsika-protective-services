import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, leads } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { forbidden, requireAdmin } from "@/lib/guard";
import { ROLES } from "@/lib/constants";
import type { LeadRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    await ensureSeeded();
    const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(300);
    const data: LeadRow[] = rows.map((l) => ({
      id: l.id,
      reference: l.reference,
      name: l.name,
      company: l.company ?? "",
      email: l.email,
      phone: l.phone ?? "",
      service: l.service ?? "",
      sector: l.sector ?? "",
      province: l.province ?? "",
      siteAddress: l.siteAddress ?? "",
      urgency: l.urgency ?? "Standard",
      message: l.message ?? "",
      status: l.status,
      createdAt: l.createdAt.toISOString(),
    }));
    return Response.json({ ok: true, leads: data });
  } catch (error) {
    console.error("lead list failed", error);
    return Response.json({ ok: false, error: "Could not load enquiries." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  if (guard.user.role === ROLES.VIEWER) return forbidden();

  try {
    const { id, status } = (await request.json()) as { id?: number; status?: string };
    if (!id || !status) {
      return Response.json({ ok: false, error: "id and status required." }, { status: 400 });
    }
    await db.update(leads).set({ status }).where(eq(leads.id, id));
    await db.insert(auditLog).values({
      actor: guard.user.name,
      action: `Enquiry marked "${status}"`,
      detail: `Lead #${id}`,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("lead update failed", error);
    return Response.json({ ok: false, error: "Could not update enquiry." }, { status: 500 });
  }
}
