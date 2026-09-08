"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Mail, MailOpen, Phone } from "lucide-react";
import { Badge, Card } from "@/components/ui";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  createdAt: string;
  handled: boolean;
}

const fmtDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export default function MessagesInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/messages")
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = await r.json();
        setMessages(data.messages || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (m: Message) => {
    const next = !m.handled;
    setMessages((ms) => ms.map((x) => (x.id === m.id ? { ...x, handled: next } : x)));
    await fetch(`/api/admin/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled: next }),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 size={22} className="animate-spin text-gold" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="p-12 text-center">
        <Mail size={28} className="mx-auto mb-3 text-faint" />
        <p className="text-[13px] text-dim">No client enquiries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 md:p-8">
      {messages.map((m) => (
        <Card key={m.id} className={`p-6 ${m.handled ? "opacity-60" : "border-gold/25"}`}>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-bold text-cream">{m.name}</span>
                {!m.handled && (
                  <Badge color="#C9A227">
                    <span className="pulse-dot mr-1 inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                    New
                  </Badge>
                )}
                {m.handled && (
                  <Badge color="#4C9A6A">
                    <Check size={10} /> Handled
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-dim">
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-gold">
                  <Mail size={11} /> {m.email}
                </a>
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1.5 hover:text-gold">
                    <Phone size={11} /> {m.phone}
                  </a>
                )}
                <span>· {fmtDateTime(m.createdAt)}</span>
              </div>
            </div>
            <button
              onClick={() => toggle(m)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] font-bold transition-colors ${
                m.handled
                  ? "border-line2 text-dim hover:border-gold/50 hover:text-gold"
                  : "border-gold/50 text-gold-pale hover:bg-gold/10"
              }`}
            >
              <MailOpen size={12} />
              {m.handled ? "Mark as new" : "Mark handled"}
            </button>
          </div>
          {m.company && <div className="mt-2 text-[12px] text-mist">Company: {m.company}</div>}
          {m.service && (
            <div className="mt-1 text-[12px]">
              <Badge tone="soft">{m.service}</Badge>
            </div>
          )}
          <p className="mt-3 rounded-md border border-line bg-coal p-4 text-[13px] leading-relaxed text-[#D6D6D6]">
            {m.message}
          </p>
        </Card>
      ))}
    </div>
  );
}
