import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    await db.insert(contactMessages).values({
      name,
      email,
      phone: String(body?.phone || "").trim() || null,
      company: String(body?.company || "").trim() || null,
      service: String(body?.service || "").trim() || null,
      message,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/contact failed", e);
    return NextResponse.json({ error: "Could not send your enquiry." }, { status: 500 });
  }
}
