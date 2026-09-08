import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-api";

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(100);

  return NextResponse.json({
    messages: rows.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      company: m.company,
      service: m.service,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
      handled: m.handled,
    })),
  });
}
