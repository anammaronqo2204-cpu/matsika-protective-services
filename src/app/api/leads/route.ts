import { sql, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, leads } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { leadRef } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = (await request.json()) as Record<string, string>;

    if (!body.name || !body.email || !body.phone) {
      return Response.json(
        { ok: false, error: "Name, email and contact number are required." },
        { status: 400 },
      );
    }

    const [inserted] = await db
      .insert(leads)
      .values({
        name: body.name.trim(),
        company: body.company ?? "",
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        service: body.service ?? "",
        sector: body.sector ?? "",
        province: body.province ?? "",
        siteAddress: body.siteAddress ?? "",
        urgency: body.urgency || "Standard",
        message: body.message ?? "",
        status: "New",
      })
      .returning({ id: leads.id });

    const reference = leadRef(inserted.id);
    await db.update(leads).set({ reference }).where(eq(leads.id, inserted.id));

    await db.insert(auditLog).values({
      actor: body.name.trim(),
      action: "Quote request received",
      detail: `${reference} · ${body.service || "General enquiry"}`,
    });

    return Response.json({ ok: true, reference });
  } catch (error) {
    console.error("lead submit failed", error);
    return Response.json(
      { ok: false, error: "We could not send your request. Please call our control room." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const rows = await db.select({ count: sql<number>`count(*)::int` }).from(leads);
    return Response.json({ ok: true, count: rows[0]?.count ?? 0 });
  } catch {
    return Response.json({ ok: false, count: 0 }, { status: 500 });
  }
}
