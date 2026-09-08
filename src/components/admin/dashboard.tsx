"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Bell,
  Briefcase,
  Clock,
  FileWarning,
  Loader2,
  MessagesSquare,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { GRADES } from "@/lib/constants";
import type { AppCandidate } from "@/lib/serialize";

interface AuditItem {
  ts: string;
  actor: string;
  action: string;
  detail: string;
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

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="p-4">
      <div
        className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: color + "1E" }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <div className="font-display text-[24px] leading-none text-cream">{value}</div>
      <div className="mt-1.5 text-[11px] text-dim">{label}</div>
    </Card>
  );
}

export default function Dashboard() {
  const [candidates, setCandidates] = useState<AppCandidate[]>([]);
  const [audit, setAudit] = useState<AuditItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/candidates")
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = await r.json();
        setCandidates(data.candidates || []);
        setAudit(data.auditLog || []);
        setUnread(data.unreadMessages || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 size={22} className="animate-spin text-gold" />
      </div>
    );
  }

  const count = (fn: (c: AppCandidate) => boolean) => candidates.filter(fn).length;
  const pipeline = [
    { label: "New / Screening", color: "#7DA3C4", n: count((c) => c.status === "New" || c.status === "Screening") },
    { label: "Documents Outstanding", color: "#C4703D", n: count((c) => c.status === "Documents Outstanding") },
    { label: "Verification Pending", color: "#C9A227", n: count((c) => c.status === "Verification Pending" || c.status === "PSiRA Verification Pending") },
    { label: "PSiRA Verified / Ready", color: "#4C9A6A", n: count((c) => c.status === "PSiRA Verified" || c.status === "Ready for Consideration") },
    { label: "Shortlisted / Interview", color: "#3FA6A6", n: count((c) => c.status === "Shortlisted" || c.status === "Interview") },
    { label: "Selected / Hired", color: "#4C9A6A", n: count((c) => c.status === "Selected" || c.status === "Hired") },
    { label: "Inactive / Rejected", color: "#7A7A7A", n: count((c) => c.status === "Inactive" || c.status === "Rejected") },
  ];
  const maxPipeline = Math.max(1, ...pipeline.map((p) => p.n));

  const stats = [
    { icon: Users, label: "Total Candidates", value: candidates.length, color: "#C9A227" },
    { icon: Bell, label: "New Applications", value: count((x) => x.status === "New"), color: "#7DA3C4" },
    { icon: FileWarning, label: "Documents Outstanding", value: count((x) => x.status === "Documents Outstanding"), color: "#C4703D" },
    { icon: Clock, label: "Verification Pending", value: count((x) => x.status === "Verification Pending" || x.status === "PSiRA Verification Pending"), color: "#C9A227" },
    { icon: BadgeCheck, label: "PSiRA Verified", value: count((x) => x.status === "PSiRA Verified" || x.status === "Ready for Consideration"), color: "#4C9A6A" },
    { icon: UserCheck, label: "Shortlisted / Interview", value: count((x) => x.status === "Shortlisted" || x.status === "Interview"), color: "#3FA6A6" },
    { icon: Briefcase, label: "Selected / Hired", value: count((x) => x.status === "Selected" || x.status === "Hired"), color: "#4C9A6A" },
    { icon: X, label: "Inactive / Rejected", value: count((x) => x.status === "Inactive" || x.status === "Rejected"), color: "#7A7A7A" },
  ];

  return (
    <div className="p-6 md:p-8">
      {unread > 0 && (
        <Link
          href="/admin/messages"
          className="mb-6 flex items-center gap-3 rounded-lg border border-gold/40 bg-gold/10 px-5 py-4 text-[13px] text-gold-pale transition-colors hover:bg-gold/15"
        >
          <MessagesSquare size={16} className="shrink-0 text-gold" />
          {unread} new client {unread === 1 ? "enquiry" : "enquiries"} awaiting response
          <span className="ml-auto text-[11px] font-bold uppercase tracking-wide">Open inbox →</span>
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 text-[14px] font-semibold text-cream">Talent Pipeline</h3>
          <div className="space-y-3">
            {pipeline.map((p) => (
              <div key={p.label}>
                <div className="mb-1 flex justify-between text-[12px] text-mist">
                  <span>{p.label}</span>
                  <span className="font-bold text-cream">{p.n}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round((p.n / maxPipeline) * 100)}%`,
                      background: `linear-gradient(90deg, ${p.color}88, ${p.color})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 text-[14px] font-semibold text-cream">Grade Distribution</h3>
          <div className="space-y-2.5">
            {GRADES.map((g) => {
              const n = count((x) => x.security.psiraGrade === g);
              const pct = candidates.length ? Math.round((n / candidates.length) * 100) : 0;
              return (
                <div key={g}>
                  <div className="mb-1 flex justify-between text-[12px] text-mist">
                    <span>Grade {g}</span>
                    <span>{n}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h3 className="mb-4 text-[14px] font-semibold text-cream">Recent Activity</h3>
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {audit.length === 0 && <p className="text-[12.5px] text-dim">No activity yet.</p>}
          {audit.map((a, i) => (
            <div key={i} className="flex gap-3 text-[12.5px]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <div className="min-w-0">
                <div className="text-[#D6D6D6]">
                  {a.action} <span className="text-dim">— {a.detail}</span>
                </div>
                <div className="text-[10.5px] text-faint">
                  {a.actor} · {fmtDateTime(a.ts)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6">
        <Badge color="#C9A227">{candidates.length} candidates in the pool</Badge>
      </div>
    </div>
  );
}
