import { eq } from "drizzle-orm";
import { db } from "@/db";
import { candidateDocuments } from "@/db/schema";
import { requireAdmin } from "@/lib/guard";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { id } = await ctx.params;
    const rows = await db
      .select()
      .from(candidateDocuments)
      .where(eq(candidateDocuments.id, Number(id) || 0))
      .limit(1);

    const doc = rows[0];
    if (!doc || !doc.dataBase64) {
      return Response.json(
        { ok: false, error: "No stored file for this document." },
        { status: 404 },
      );
    }

    const buffer = Buffer.from(doc.dataBase64, "base64");
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": doc.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${doc.filename ?? "document"}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("document download failed", error);
    return Response.json({ ok: false, error: "Download failed." }, { status: 500 });
  }
}
