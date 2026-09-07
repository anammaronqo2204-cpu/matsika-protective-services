"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button, Card, Field, Select, TextArea, TextInput } from "@/components/ui";
import { PROVINCES, SECTORS, SERVICES } from "@/lib/constants";

const URGENCY = ["Standard", "Urgent", "Emergency"];

export default function QuoteForm() {
  const params = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: params.get("service") ?? "",
    sector: "",
    province: "",
    siteAddress: "",
    urgency: "Standard",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone) {
      setError("Name, email and contact number are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as { ok: boolean; reference?: string; error?: string };
      if (!json.ok) setError(json.error ?? "Submission failed.");
      else setReference(json.reference ?? "REQ");
    } catch {
      setError("Network error. Please try again or call our control room.");
    } finally {
      setLoading(false);
    }
  };

  if (reference) {
    return (
      <Card className="p-9 text-center">
        <div className="w-14 h-14 rounded-full bg-[#4C9A6A]/15 border border-[#4C9A6A]/40 grid place-items-center mx-auto mb-5">
          <CheckCircle2 size={26} className="text-[#4C9A6A]" />
        </div>
        <h2 className="text-white font-display text-[26px] mb-2">Request received</h2>
        <p className="text-mist text-[13.5px] leading-relaxed mb-5">
          A Matsika risk consultant will contact you within one business hour during office hours,
          or immediately if you flagged the request as an emergency.
        </p>
        <div className="bg-[#0A0A0C] border border-line rounded-lg py-4">
          <div className="text-[10px] tracking-[0.2em] uppercase text-mute mb-1">
            Your enquiry reference
          </div>
          <div className="text-gold font-display text-[26px]">{reference}</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={submit}>
        <div className="grid sm:grid-cols-2 gap-x-5">
          <Field label="Your Name" required>
            <TextInput value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </Field>
          <Field label="Company / Body Corporate">
            <TextInput value={form.company} onChange={(e) => set({ company: e.target.value })} />
          </Field>
          <Field label="Email Address" required>
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
            />
          </Field>
          <Field label="Contact Number" required>
            <TextInput value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
          </Field>
          <Field label="Service Required">
            <Select value={form.service} onChange={(e) => set({ service: e.target.value })}>
              <option value="">Select a service…</option>
              {SERVICES.map((s) => (
                <option key={s.slug}>{s.title}</option>
              ))}
              <option>Integrated / Not sure yet</option>
            </Select>
          </Field>
          <Field label="Sector">
            <Select value={form.sector} onChange={(e) => set({ sector: e.target.value })}>
              <option value="">Select a sector…</option>
              {SECTORS.map((s) => (
                <option key={s.title}>{s.title}</option>
              ))}
            </Select>
          </Field>
          <Field label="Province">
            <Select value={form.province} onChange={(e) => set({ province: e.target.value })}>
              <option value="">Select…</option>
              {PROVINCES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>
          <Field label="Urgency">
            <Select value={form.urgency} onChange={(e) => set({ urgency: e.target.value })}>
              {URGENCY.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Site Address" hint="Where should we conduct the survey?">
          <TextInput
            value={form.siteAddress}
            onChange={(e) => set({ siteAddress: e.target.value })}
          />
        </Field>
        <Field label="Tell us about your requirement">
          <TextArea
            value={form.message}
            onChange={(e) => set({ message: e.target.value })}
            placeholder="Number of posts, hours of cover, existing infrastructure, current provider…"
          />
        </Field>

        {error && (
          <p className="text-[#E3948F] text-[12.5px] mb-3 flex items-center gap-1.5">
            <AlertCircle size={13} /> {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send size={15} /> Send Request
            </>
          )}
        </Button>
        <p className="text-mute text-[11px] leading-relaxed mt-4">
          By submitting this form you consent to Matsika Protective Services contacting you about
          your enquiry. Your information is processed in line with POPIA and never sold.
        </p>
      </form>
    </Card>
  );
}
