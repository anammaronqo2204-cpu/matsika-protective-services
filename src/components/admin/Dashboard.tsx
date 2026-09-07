"use client";

import {
  Activity,
  BadgeCheck,
  Bell,
  Briefcase,
  ClipboardCheck,
  Clock,
  FileWarning,
  Inbox,
  UserCheck,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { GRADES, LEAD_STATUS_COLORS, STATUS_COLORS } from "@/lib/constants";
import { fmtDateTime } from "@/lib/format";

export type Overview = {
  totals: { total: number; last7: number; notifyOptIn: number; avgExperience: number };
  vacancyTotals: { open: number; positions: number };
  statusCounts: { status: string; count: number }[];
  gradeCounts: { grade: string | null; count: number }[];
  provinceCounts: { province: string | null; count: number }[];
  leadCounts: { status: string; count: number }[];
  recentAudit: { id: number; actor: string; action: string; detail: string; createdAt: string }[];
  recentCandidates: {
    id: string;
    refNumber: string;
    fullName: string;
    status: string;
    province: string | null;
    psiraGrade: string | null;
    createdAt: string;
  }[];
  recentLeads: {
    id: number;
    reference: string;
    name: string;
    company: string;
    service: string;
    status: string;
    urgency: string;
    createdAt: string;
  }[];
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <Card className="p-4 hover:border-gold/35 transition-colors">
      <div
        className="w-8 h-8 rounded-lg grid place-items-center mb-3"
        style={{ backgroundColor: color + "1E" }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <div className="text-[26px] font-display text-white leading-none">{value}</div>
      <div className="text-[11px] text-mute mt-1.5">{label}</div>
    </Card>
  );
}

export default function Dashboard({
  overview,
  onOpenCandidate,
  onGoto,
}: {
  overview: Overview;
  onOpenCandidate: (id: string) => void;
  onGoto: (page: string) => void;
}) {
  const count = (status: string) =>
    overview.statusCounts.find((s) => s.status === status)?.count ?? 0;

  const stats: { icon: LucideIcon; label: string; value: number | string; color: string }[] = [
    { icon: Users, label: "Total candidates", value: overview.totals.total, color: "#C9A227" },
    { icon: Bell, label: "New applications", value: count("New"), color: "#7DA3C4" },
    {
      icon: FileWarning,
      label: "Documents outstanding",
      value: count("Documents Outstanding"),
      color: "#C4703D",
    },
    {
      icon: Clock,
      label: "Verification pending",
      value: count("Verification Pending") + count("PSiRA Verification Pending"),
      color: "#C9A227",
    },
    { icon: BadgeCheck, label: "PSiRA verified", value: count("PSiRA Verified"), color: "#4C9A6A" },
    {
      icon: ClipboardCheck,
      label: "Ready for consideration",
      value: count("Ready for Consideration"),
      color: "#4C9A6A",
    },
    { icon: UserCheck, label: "Shortlisted", value: count("Shortlisted"), color: "#3FA6A6" },
    { icon: Briefcase, label: "Hired", value: count("Hired"), color: "#4C9A6A" },
    { icon: XCircle, label: "Inactive / rejected", value: count("Inactive") + count("Rejected"), color: "#7A7A7A" },
  ];

  const totalCandidates = Math.max(overview.totals.total, 1);
  const openLeads = overview.leadCounts.reduce(
    (acc, l) => acc + (l.status === "New" || l.status === "Contacted" ? l.count : 0),
    0,
  );

  return (
    <div className="p-5 md:p-8 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-white text-[26px]">Operations Dashboard</h1>
          <p className="text-mute text-[13px] mt-1">
            Live view of the recruitment pipeline, client enquiries and platform activity.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-lg border border-line bg-panel px-4 py-2.5">
            <div className="text-[10px] uppercase tracking-[0.14em] text-mute">Last 7 days</div>
            <div className="text-gold font-display text-[20px] leading-tight">
              +{overview.totals.last7}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-panel px-4 py-2.5">
            <div className="text-[10px] uppercase tracking-[0.14em] text-mute">Open posts</div>
            <div className="text-gold font-display text-[20px] leading-tight">
              {overview.vacancyTotals.positions}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-panel px-4 py-2.5">
            <div className="text-[10px] uppercase tracking-[0.14em] text-mute">Open enquiries</div>
            <div className="text-gold font-display text-[20px] leading-tight">{openLeads}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-7">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-1">
          <h3 className="text-white font-semibold text-[14px] mb-4">Pipeline by status</h3>
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {overview.statusCounts
              .slice()
              .sort((a, b) => b.count - a.count)
              .map((s) => (
                <div key={s.status}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-mist">{s.status}</span>
                    <span className="text-white font-semibold">{s.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#161618] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round((s.count / totalCandidates) * 100)}%`,
                        backgroundColor: STATUS_COLORS[s.status] ?? "#C9A227",
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-white font-semibold text-[14px] mb-4">PSiRA grade distribution</h3>
          <div className="space-y-2.5">
            {GRADES.map((g) => {
              const n = overview.gradeCounts.find((x) => x.grade === g)?.count ?? 0;
              const pct = Math.round((n / totalCandidates) * 100);
              return (
                <div key={g}>
                  <div className="flex justify-between text-[12px] text-mist mb-1">
                    <span>{g === "Not yet registered" ? g : `Grade ${g}`}</span>
                    <span className="text-white font-semibold">{n}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#161618] overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#C9A227] to-[#E9C85A] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-line-soft grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-mute">Avg experience</div>
              <div className="text-white font-display text-[20px]">
                {overview.totals.avgExperience} yrs
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-mute">Alert opt-ins</div>
              <div className="text-white font-display text-[20px]">
                {overview.totals.notifyOptIn}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-white font-semibold text-[14px] mb-4">Talent by province</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {overview.provinceCounts.map((p) => (
              <div
                key={p.province ?? "unknown"}
                className="flex items-center justify-between text-[12.5px] py-1.5 border-b border-line-soft last:border-0"
              >
                <span className="text-mist">{p.province || "Unspecified"}</span>
                <span className="text-white font-semibold">{p.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-[14px]">Latest applications</h3>
            <button
              onClick={() => onGoto("candidates")}
              className="text-[11.5px] text-gold hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="space-y-1">
            {overview.recentCandidates.map((c) => (
              <button
                key={c.id}
                onClick={() => onOpenCandidate(c.id)}
                className="w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-white/4 transition-colors text-left"
              >
                <div className="min-w-0">
                  <div className="text-[13px] text-white font-medium truncate">{c.fullName}</div>
                  <div className="text-[11px] text-mute font-mono">
                    {c.refNumber} · {c.province || "—"} · Grade {c.psiraGrade}
                  </div>
                </div>
                <Badge color={STATUS_COLORS[c.status]}>{c.status}</Badge>
              </button>
            ))}
            {overview.recentCandidates.length === 0 && (
              <p className="text-mute text-[12.5px] py-6 text-center">No applications yet.</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-[14px] flex items-center gap-2">
              <Inbox size={14} className="text-gold" /> Client enquiries
            </h3>
            <button
              onClick={() => onGoto("leads")}
              className="text-[11.5px] text-gold hover:underline"
            >
              Open →
            </button>
          </div>
          <div className="space-y-2.5">
            {overview.recentLeads.map((l) => (
              <div key={l.id} className="border border-line rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12.5px] text-white font-medium truncate">{l.name}</span>
                  <Badge color={LEAD_STATUS_COLORS[l.status]}>{l.status}</Badge>
                </div>
                <div className="text-[11px] text-mute mt-1 truncate">
                  {l.company || "Private"} · {l.service || "General"}
                </div>
              </div>
            ))}
            {overview.recentLeads.length === 0 && (
              <p className="text-mute text-[12.5px] py-6 text-center">No enquiries yet.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-4">
        <h3 className="text-white font-semibold text-[14px] mb-4 flex items-center gap-2">
          <Activity size={14} className="text-gold" /> Activity &amp; audit trail
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {overview.recentAudit.map((a) => (
            <div key={a.id} className="flex gap-3 text-[12.5px]">
              <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-zinc-300">
                  {a.action} {a.detail && <span className="text-mute">— {a.detail}</span>}
                </div>
                <div className="text-[10.5px] text-[#5C5C5C]">
                  {a.actor} · {fmtDateTime(a.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
