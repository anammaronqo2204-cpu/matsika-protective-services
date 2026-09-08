"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button, Field, Select, TextArea, TextInput } from "./ui";

const services = [
  "Manned guarding",
  "Access control",
  "CCTV monitoring",
  "Response coordination",
  "Event security",
  "Risk assessment",
  "General enquiry",
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", service: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please provide your name, email address and a short description of the requirement.");
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The enquiry could not be submitted.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The enquiry could not be submitted.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rise rise-1 border border-gold bg-panel p-8 md:p-10">
        <span className="inline-flex border border-gold p-3 text-gold">
          <Check size={22} />
        </span>
        <h2 className="mt-6 text-[24px] font-semibold text-white">Your enquiry has been received.</h2>
        <p className="mt-4 max-w-lg text-[14px] leading-7 text-dim">
          Thank you. A member of the Matsika team will review the information and contact you using the details provided.
        </p>
        <button onClick={() => setSent(false)} className="u-line mt-7 text-[12px] font-bold uppercase tracking-[0.08em] text-gold">
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-line bg-panel p-6 transition-colors duration-300 focus-within:border-gold/40 hover:border-line2 md:p-9">
      <div className="mb-8 border-b border-line pb-6">
        <h2 className="text-[22px] font-semibold text-white">Security enquiry</h2>
        <p className="mt-2 text-[13px] leading-6 text-dim">Fields marked with an asterisk are required.</p>
      </div>
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="Full name" required><TextInput value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Business email" required><TextInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Telephone"><TextInput value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Company or organisation"><TextInput value={form.company} onChange={(e) => set("company", e.target.value)} /></Field>
      </div>
      <Field label="Service required">
        <Select value={form.service} onChange={(e) => set("service", e.target.value)}>
          <option value="">Select a service</option>
          {services.map((service) => <option key={service}>{service}</option>)}
        </Select>
      </Field>
      <Field label="Requirement" required hint="Include the site type, location, operating hours and current concern where possible.">
        <TextArea className="min-h-[140px]" value={form.message} onChange={(e) => set("message", e.target.value)} />
      </Field>
      {error && <p className="mb-4 flex items-start gap-2 text-[12px] leading-5 text-[#e3948f]"><AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}</p>}
      <Button type="submit" disabled={sending} className="btn-arrow w-full sm:w-auto" size="lg">
        {sending ? <Loader2 size={14} className="animate-spin" /> : null}
        {sending ? "Submitting" : "Submit enquiry"}
        {!sending ? <ArrowRight size={15} /> : null}
      </Button>
      <p className="mt-5 text-[10.5px] leading-5 text-faint">Information submitted through this form is used to respond to your enquiry and is handled in accordance with applicable privacy requirements.</p>
    </form>
  );
}
