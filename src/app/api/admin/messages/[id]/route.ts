import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const handled = Boolean(body?.handled);

  const rows = await db
    .update(contactMessages)
    .set({ handled })
    .where(eq(contactMessages.id, id))
    .returning();
  if (!rows[0]) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  return NextResponse.json({ ok: true, handled });
}
