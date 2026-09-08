import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, sessionPublic } from "@/lib/admin-api";

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json(sessionPublic(user));
}
