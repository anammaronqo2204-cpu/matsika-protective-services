"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  FileText,
  Info,
  Loader2,
  Lock,
  Plus,
  Shield,
  StickyNote,
  Users,
} from "lucide-react";
import { Badge, Button, Card, Select, TextInput } from "@/components/ui";
import {
  ADMIN_STATUS_FLOW,
  DOC_STATUSES,
  DOC_TYPES,
  STATUS_COLORS,
} from "@/lib/constants";
import type { AppCandidate } from "@/lib/serialize";

const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "2-digit" });
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-1.5 text-[13px]">
      <span className="text-dim">{label}</span>
      <span className="text-right text-cream">{value || "—"}</span>
    </div>
  );
}

export default function CandidateProfile() {
  const params = useParams<{ id: string }>();
  const [cand, setCand] = useState<AppCandidate | null>(null);
  const [admin, setAdmin] = useState<{ name: string; role: string }>({ name: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then(async (r) => {
        if (r.ok) {
          const data = await r.json();
          setAdmin({ name: data.name, role: data.role });
        }
      })
      .catch(() => {});
    fetch(`/api/admin/candidates/${params.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = await r.json();
        setCand(data.candidate);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const canEditStatus = admin.role === "Super Administrator" || admin.role === "Recruitment Administrator";
  const canEditDocs = admin.role !== "Read Only";
  const canAddNotes = admin.role !== "Read Only";

  const save = useCallback(
    async (next: AppCandidate, auditAction: string) => {
      if (!cand) return;
      setSaving(true);
      setCand(next);
      try {
        const res = await fetch(`/api/admin/candidates/${cand.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidate: next, auditAction }),
        });
        const data = await res.json();
        if (res.ok && data.candidate) setCand(data.candidate);
      } catch {
        /* keep optimistic state */
      } finally {
        setSaving(false);
      }
    },
    [cand]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 size={22} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!cand) {
    return <div className="p-8 text-[13px] text-dim">Candidate not found.</div>;
  }

  const setStatus = (status: string) =>
    save(
      {
        ...cand,
        status,
        statusHistory: [
          ...cand.statusHistory,
          { status, timestamp: new Date().toISOString(), by: admin.name },
        ],
      },
      `Status changed to "${status}"`
    );

  const setDocStatus = (key: string, status: string) =>
    save(
      {
        ...cand,
        documents: {
          ...cand.documents,
          [key]: { ...cand.documents[key], status },
        },
      },
      `${DOC_TYPES.find((d) => d.key === key)?.label || key} marked "${status}"`
    );

  const addNote = () => {
    if (!noteText.trim()) return;
    save(
      {
        ...cand,
        internalNotes: [
          ...cand.internalNotes,
          { text: noteText.trim(), timestamp: new Date().toISOString(), by: admin.name },
        ],
      },
      "Internal note added"
    );
    setNoteText("");
  };

  const TABS = [
    { key: "overview", label: "Overview", icon: Users },
    { key: "security", label: "Security & Training", icon: Shield },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "status", label: "Status & Notes", icon: StickyNote },
  ];

  return (
    <div className="p-6 md:p-8">
      <Link
        href="/admin/candidates"
        className="mb-5 inline-flex items-center gap-1.5 text-[12px] text-dim transition-colors hover:text-gold"
      >
        <ArrowLeft size={13} /> Back to candidates
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[26px] font-semibold text-cream">{cand.personal.fullName}</h1>
            {cand.demo && <Badge tone="soft">DEMO DATA</Badge>}
          </div>
          <p className="font-mono text-[13px] text-dim">
            {cand.refNumber} · Applied {fmtDate(cand.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-gold">
              <Loader2 size={12} className="animate-spin" /> Saving…
            </span>
          )}
          <Badge color={STATUS_COLORS[cand.status] || "#C9A227"}>{cand.status}</Badge>
        </div>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors ${
              tab === t.key
                ? "border-gold text-gold-pale"
                : "border-transparent text-dim hover:text-[#D6D6D6]"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Contact</h3>
            <Row label="Full name" value={cand.personal.fullName} />
            <Row label="ID / Passport" value={cand.personal.idNumber} />
            <Row label="Date of birth" value={fmtDate(cand.personal.dob)} />
            <Row label="Gender" value={cand.personal.gender} />
            <Row label="Mobile" value={cand.personal.mobile} />
            <Row label="Email" value={cand.personal.email} />
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Location</h3>
            <Row label="Address" value={cand.personal.address} />
            <Row label="City / Town" value={cand.personal.city} />
            <Row label="Province" value={cand.personal.province} />
            <Row label="Preferred areas" value={cand.personal.preferredAreas} />
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Availability</h3>
            <Row label="Availability" value={cand.availability.availability} />
            <Row label="Shift" value={cand.availability.shift} />
            <Row label="Employment type" value={cand.availability.employmentType} />
            <Row label="Preferred locations" value={cand.availability.preferredLocations} />
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Opportunity Alerts</h3>
            <Row label="Notifications" value={cand.notify.enabled ? "Enabled" : "Disabled"} />
            {cand.notify.enabled && (
              <>
                <Row label="Grade" value={cand.notify.grade || "Any"} />
                <Row label="Location" value={cand.notify.location || "Any"} />
                <Row label="Shift" value={cand.notify.shift || "Any"} />
              </>
            )}
            <Row
              label="POPIA consent"
              value={cand.consent.agreed ? `Accepted ${fmtDateTime(cand.consent.timestamp || "")}` : "Not accepted"}
            />
          </Card>
        </div>
      )}

      {tab === "security" && (
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
              Security Profile <span className="font-normal normal-case text-faint">(candidate-provided)</span>
            </h3>
            <Row label="PSiRA number" value={cand.security.psiraNumber} />
            <Row label="PSiRA grade" value={cand.security.psiraGrade} />
            <Row label="PSiRA status" value={cand.security.psiraStatus} />
            <Row label="Experience" value={cand.security.yearsExperience ? `${cand.security.yearsExperience} years` : ""} />
            <Row label="Previous employer" value={cand.security.previousEmployer} />
            <Row label="Previous sites" value={cand.security.previousSites} />
            <Row label="Reference details" value={cand.security.referenceDetails} />
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-faint">
              <Info size={12} className="mt-0.5 shrink-0" />
              Subject to independent verification through official PSiRA processes.
            </p>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
              Training &amp; Qualifications
            </h3>
            {cand.training.qualifications.length === 0 && (
              <p className="text-[12.5px] text-[#5C5C5C]">None listed.</p>
            )}
            <div className="mb-3 space-y-2">
              {cand.training.qualifications.map((q) => (
                <div key={q.id} className="rounded-md border border-line2 p-2.5 text-[12.5px]">
                  <div className="font-medium text-cream">{q.type || "Untitled qualification"}</div>
                  <div className="text-dim">
                    {q.provider}
                    {q.completionDate && ` · ${fmtDate(q.completionDate)}`}
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-2 flex gap-4">
              <Badge tone="soft">First Aid: {cand.training.firstAid ? "Yes" : "No"}</Badge>
              <Badge tone="soft">Firefighting: {cand.training.firefighting ? "Yes" : "No"}</Badge>
            </div>
            {cand.training.other && <Row label="Other certificates" value={cand.training.other} />}
          </Card>
        </div>
      )}

      {tab === "documents" && (
        <Card className="p-5">
          <div className="space-y-2.5">
            {DOC_TYPES.map((d) => {
              const doc = cand.documents[d.key];
              return (
                <div
                  key={d.key}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line2 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium text-cream">{d.label}</div>
                    <div className="truncate text-[11.5px] text-dim">
                      {doc.filename || "Not provided"}
                      {doc.uploadedAt && ` · ${fmtDateTime(doc.uploadedAt)}`}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {canEditDocs ? (
                      <Select
                        value={doc.status}
                        onChange={(e) => setDocStatus(d.key, e.target.value)}
                        className="min-w-[130px] !py-1.5 !text-[12px]"
                      >
                        {DOC_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </Select>
                    ) : (
                      <Badge color="#B5453F" tone="soft">
                        <Lock size={10} /> Read only
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {admin.role === "Read Only" && (
            <p className="mt-4 flex items-center gap-1.5 text-[11px] text-faint">
              <Lock size={11} /> Your role ({admin.role}) has read-only access to document status.
            </p>
          )}
        </Card>
      )}

      {tab === "status" && (
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
              Recruitment Status
            </h3>
            <div className="mb-4">
              <Select
                value={cand.status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!canEditStatus}
              >
                {ADMIN_STATUS_FLOW.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
              {!canEditStatus && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-faint">
                  <Lock size={11} /> Your role ({admin.role}) cannot change recruitment status.
                </p>
              )}
            </div>
            <h4 className="mb-2 text-[11px] uppercase tracking-wide text-dim">History</h4>
            <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
              {[...cand.statusHistory].reverse().map((h, i) => (
                <div key={i} className="flex gap-3 text-[12.5px]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <div>
                    <span className="text-cream">{h.status}</span>{" "}
                    <span className="text-faint">· {h.by} · {fmtDateTime(h.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
              <StickyNote size={13} /> Internal Notes
              <span className="font-normal normal-case text-faint">(admin-only, never shown to candidate)</span>
            </h3>
            <div className="mb-4 max-h-52 space-y-2.5 overflow-y-auto pr-1">
              {cand.internalNotes.length === 0 && (
                <p className="text-[12.5px] text-[#5C5C5C]">No internal notes yet.</p>
              )}
              {[...cand.internalNotes].reverse().map((n, i) => (
                <div key={i} className="rounded-md border border-line2 bg-coal p-2.5 text-[12.5px]">
                  <p className="text-[#D6D6D6]">{n.text}</p>
                  <p className="mt-1 text-[10.5px] text-faint">
                    {n.by} · {fmtDateTime(n.timestamp)}
                  </p>
                </div>
              ))}
            </div>
            {canAddNotes ? (
              <div className="flex gap-2">
                <TextInput
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add an internal note…"
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                />
                <Button size="sm" onClick={addNote} aria-label="Add note">
                  <Plus size={13} />
                </Button>
              </div>
            ) : (
              <p className="flex items-center gap-1.5 text-[11px] text-faint">
                <Lock size={11} /> Your role ({admin.role}) cannot add notes.
              </p>
            )}
          </Card>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
        <BadgeCheck size={15} className="text-gold" />
        <span className="text-[11.5px] text-dim">
          Candidate ID: <span className="font-mono text-faint">{cand.id}</span>
        </span>
      </div>
    </div>
  );
}
