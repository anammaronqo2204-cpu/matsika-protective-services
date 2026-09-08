"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Clock,
  Loader2,
  Search,
} from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import { Badge, Button, Card, Field, TextInput } from "@/components/ui";
import { DOC_STATUS_COLORS, DOC_TYPES } from "@/lib/constants";

interface StatusResult {
  refNumber: string;
  fullName: string;
  createdAt: string;
  province: string;
  status: string;
  statusLabel: string;
  statusColor: string;
  documents: { key: string; label: string; status: string }[];
  history: { status: string; label: string; timestamp: string }[];
}

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
};
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

export default function StatusPage() {
  const [ref, setRef] = useState("");
  const [idNum, setIdNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [err, setErr] = useState("");

  const check = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr("");
    setResult(null);
    if (!ref.trim() || !idNum.trim()) {
      setErr("Please enter both your reference number and ID / passport number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/status?ref=${encodeURIComponent(ref.trim())}&id=${encodeURIComponent(idNum.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not check your application.");
      setResult(data);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Could not check your application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <SiteNav />
      <div className="mx-auto w-full max-w-md flex-1 px-5 py-16">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[12px] text-dim transition-colors hover:text-gold"
        >
          <ArrowLeft size={13} /> Back to home
        </Link>
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/30 bg-gold/10">
            <BadgeCheck size={19} className="text-gold" />
          </div>
          <div>
            <h1 className="font-display text-[28px] font-semibold text-cream">Check Application Status</h1>
            <p className="text-[12.5px] text-dim">Enter your reference number and ID/passport number.</p>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={check}>
            <Field label="Application Reference" required>
              <TextInput value={ref} onChange={(e) => setRef(e.target.value)} placeholder="MPS-000001" />
            </Field>
            <Field label="ID / Passport Number" required>
              <TextInput
                value={idNum}
                onChange={(e) => setIdNum(e.target.value)}
                placeholder="As entered at registration"
              />
            </Field>
            {err && (
              <p className="mb-3 flex items-center gap-1.5 text-[12.5px] text-[#E3948F]">
                <AlertCircle size={13} /> {err}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              {loading ? "Checking…" : "Check Status"}
            </Button>
          </form>
        </Card>

        {result && (
          <Card className="mt-5 p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-dim">Reference</div>
                <div className="font-display text-[22px] font-bold text-gold">{result.refNumber}</div>
                <div className="mt-1 text-[12px] text-mist">{result.fullName}</div>
              </div>
              <Badge color={result.statusColor}>{result.statusLabel}</Badge>
            </div>

            <div className="flex items-center justify-between border-b border-line py-1.5 text-[13px]">
              <span className="text-dim">Date applied</span>
              <span className="text-cream">{fmtDate(result.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-line py-1.5 text-[13px]">
              <span className="text-dim">Province</span>
              <span className="text-cream">{result.province}</span>
            </div>

            <h4 className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Documents</h4>
            <div className="space-y-2">
              {result.documents.map((d) => (
                <div key={d.key} className="flex items-center justify-between text-[13px]">
                  <span className="text-mist">{d.label}</span>
                  <Badge color={DOC_STATUS_COLORS[d.status] || "#8F8F8F"}>{d.status}</Badge>
                </div>
              ))}
            </div>

            {result.history.length > 0 && (
              <>
                <h4 className="mb-2 mt-5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
                  <Clock size={12} /> Status Timeline
                </h4>
                <div className="space-y-2.5">
                  {[...result.history].reverse().map((h, i) => (
                    <div key={i} className="flex gap-3 text-[12.5px]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>
                        <span className="text-cream">{h.label}</span>{" "}
                        <span className="text-faint">· {fmtDateTime(h.timestamp)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <p className="mt-5 flex items-center gap-1.5 text-[10.5px] text-faint">
              <AlertCircle size={11} className="shrink-0" />
              Need more detail? Email careers@matsikaprotective.co.za with your reference number.
            </p>
          </Card>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
