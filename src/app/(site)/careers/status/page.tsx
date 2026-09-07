"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, Search } from "lucide-react";
import { Badge, Button, Card, Field, TextInput } from "@/components/ui";
import { DOC_STATUS_COLORS, STATUS_COLORS } from "@/lib/constants";
import { fmtDate, fmtDateTime } from "@/lib/format";
import type { PublicStatusResult } from "@/lib/types";

export default function StatusPage() {
  const [reference, setReference] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [result, setResult] = useState<PublicStatusResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/applications/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, idNumber }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        result?: PublicStatusResult;
        error?: string;
      };
      if (!json.ok || !json.result) setError(json.error ?? "Lookup failed.");
      else setResult(json.result);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 md:py-20">
      <Link
        href="/careers"
        className="inline-flex items-center gap-1.5 text-mute text-[12px] mb-6 hover:text-gold"
      >
        <ArrowLeft size={13} /> Back to careers
      </Link>

      <h1 className="font-display text-white text-[32px] md:text-[40px] leading-tight">
        Track Your Application
      </h1>
      <p className="text-mute text-[13px] mt-2 mb-8">
        Enter the reference number issued when you registered, together with the ID or passport
        number you applied with.
      </p>

      <Card className="p-6 md:p-7">
        <form onSubmit={check}>
          <Field label="Application Reference" required>
            <TextInput
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="MPS-000001"
            />
          </Field>
          <Field label="ID / Passport Number" required>
            <TextInput
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="As entered at registration"
            />
          </Field>
          {error && (
            <p className="text-[#E3948F] text-[12.5px] mb-3 flex items-center gap-1.5">
              <AlertCircle size={13} /> {error}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Checking…
              </>
            ) : (
              <>
                <Search size={14} /> Check Status
              </>
            )}
          </Button>
        </form>
      </Card>

      {result && (
        <>
          <Card className="p-6 mt-5">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
              <div>
                <div className="text-[10.5px] text-mute uppercase tracking-[0.18em]">Reference</div>
                <div className="text-gold font-display text-[24px]">{result.refNumber}</div>
              </div>
              <Badge color={STATUS_COLORS[result.status]}>{result.publicStatus}</Badge>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: "Applicant", value: result.fullName },
                { label: "Province", value: result.province || "—" },
                { label: "Date applied", value: fmtDate(result.createdAt) },
              ].map((r) => (
                <div key={r.label} className="rounded-lg border border-line bg-[#0A0A0C] px-4 py-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-mute">{r.label}</div>
                  <div className="text-zinc-100 text-[13px] mt-1">{r.value}</div>
                </div>
              ))}
            </div>

            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-3">
              Document checklist
            </h3>
            <div className="space-y-2">
              {result.documents.map((d) => (
                <div key={d.key} className="flex justify-between items-center text-[13px]">
                  <span className="text-mist">{d.label}</span>
                  <Badge color={DOC_STATUS_COLORS[d.status]}>{d.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 mt-4">
            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-4">
              Progress history
            </h3>
            <ol className="relative border-l border-line pl-5 space-y-4">
              {result.history.map((h, i) => (
                <li key={`${h.status}-${i}`} className="relative">
                  <span className="absolute -left-[26px] top-1.5 w-2.5 h-2.5 rounded-full bg-gold ring-4 ring-panel" />
                  <p className="text-zinc-100 text-[13px]">{h.publicStatus}</p>
                  <p className="text-mute text-[11px] mt-0.5">{fmtDateTime(h.createdAt)}</p>
                </li>
              ))}
            </ol>
          </Card>

          <p className="text-mute text-[11.5px] leading-relaxed mt-5">
            Status updates are made by our recruitment team as your application progresses.
            Registration does not guarantee employment or deployment, and PSiRA status is verified
            independently through official processes.
          </p>
        </>
      )}
    </div>
  );
}
