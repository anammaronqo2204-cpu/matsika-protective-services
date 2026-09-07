import { desc } from "drizzle-orm";
import { db } from "@/db";
import { auditLog, candidates } from "@/db/schema";
import { requireAdmin } from "@/lib/guard";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const rows = await db.select().from(candidates).orderBy(desc(candidates.createdAt));
    const header = [
      "Reference",
      "Full name",
      "ID number",
      "Mobile",
      "Email",
      "City",
      "Province",
      "PSiRA number",
      "Grade",
      "PSiRA status",
      "Experience (yrs)",
      "Availability",
      "Shift",
      "Employment type",
      "Application status",
      "Applied",
    ];
    const lines = [header.map(csvCell).join(",")];
    for (const c of rows) {
      lines.push(
        [
          c.refNumber,
          c.fullName,
          c.idNumber,
          c.mobile,
          c.email,
          c.city,
          c.province,
          c.psiraNumber,
          c.psiraGrade,
          c.psiraStatus,
          c.yearsExperience,
          c.availability,
          c.shift,
          c.employmentType,
          c.status,
          c.createdAt.toISOString().slice(0, 10),
        ]
          .map(csvCell)
          .join(","),
      );
    }

    await db.insert(auditLog).values({
      actor: guard.user.name,
      action: "Candidate register exported",
      detail: `${rows.length} records`,
    });

    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="matsika-candidates-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("export failed", error);
    return Response.json({ ok: false, error: "Export failed." }, { status: 500 });
  }
}
