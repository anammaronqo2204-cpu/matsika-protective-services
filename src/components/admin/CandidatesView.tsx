"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Loader2,
  Lock,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  StickyNote,
  Users,
} from "lucide-react";
import { Badge, Button, Card, Select, TextInput } from "@/components/ui";
import {
  ADMIN_STATUS_FLOW,
  AVAILABILITY_OPTS,
  DOC_STATUSES,
  DOC_STATUS_COLORS,
  DOC_TYPES,
  GRADES,
  PROVINCES,
  PSIRA_STATUSES,
  ROLE_CAN_ADD_NOTES,
  ROLE_CAN_EDIT_DOCS,
  ROLE_CAN_EDIT_STATUS,
  SHIFT_OPTS,
  STATUS_COLORS,
} from "@/lib/constants";
import { bytes, fmtDate, fmtDateTime } from "@/lib/format";
import type { AdminCandidateDetail, AdminCandidateRow } from "@/lib/types";

const EMPTY_FILTERS = {
  grade: "",
  province: "",
  psiraStatus: "",
  availability: "",
  shift: "",
  minExperience: "",
  applicationStatus: "",
  documentStatus: "",
};

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-line-soft text-[13px]">
      <span className="text-mute">{label}</span>
      <span className="text-zinc-100 text-right break-words">{value || "—"}</span>
    </div>
  );
}

/* ------------------------------ Detail view ------------------------------- */

function CandidateDetail({
  id,
  role,
  onBack,
  onChanged,
}: {
  id: string;
  role: string;
  onBack: () => void;
  onChanged: () => void;
}) {
  const [detail, setDetail] = useState<AdminCandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/candidates/${id}`);
    const json = (await res.json()) as { ok: boolean; candidate?: AdminCandidateDetail };
    if (json.ok && json.candidate) setDetail(json.candidate);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (payload: Record<string, unknown>) => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok: boolean;
        candidate?: AdminCandidateDetail;
        error?: string;
      };
      if (!json.ok) setError(json.error ?? "Update failed.");
      else if (json.candidate) {
        setDetail(json.candidate);
        onChanged();
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  };

  if (loading || !detail) {
    return (
      <div className="p-8 grid place-items-center min-h-[50vh]">
        <Loader2 size={20} className="animate-spin text-gold" />
      </div>
    );
  }

  const canStatus = ROLE_CAN_EDIT_STATUS[role];
  const canDocs = ROLE_CAN_EDIT_DOCS[role];
  const canNotes = ROLE_CAN_ADD_NOTES[role];

  const TABS = [
    { key: "overview", label: "Overview", icon: Users },
    { key: "security", label: "Security & Training", icon: Shield },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "status", label: "Status & Notes", icon: StickyNote },
  ];

  return (
    <div className="p-5 md:p-8 max-w-6xl">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-mute text-[12px] mb-5 hover:text-gold"
      >
        <ArrowLeft size={13} /> Back to candidates
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-white text-[26px]">{detail.fullName}</h1>
            {detail.isDemo && <Badge tone="soft">DEMO DATA</Badge>}
          </div>
          <p className="text-mute text-[12.5px] font-mono mt-1">
            {detail.refNumber} · Applied {fmtDate(detail.createdAt)}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[12px] text-mist">
            <a href={`tel:${detail.mobile}`} className="inline-flex items-center gap-1.5 hover:text-gold">
              <Phone size={12} className="text-gold/70" /> {detail.mobile}
            </a>
            <a
              href={`mailto:${detail.email}`}
              className="inline-flex items-center gap-1.5 hover:text-gold"
            >
              <Mail size={12} className="text-gold/70" /> {detail.email}
            </a>
          </div>
        </div>
        <Badge color={STATUS_COLORS[detail.status]}>{detail.status}</Badge>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-[#B5453F]/40 bg-[#B5453F]/10 px-4 py-2.5 text-[12.5px] text-[#E3948F]">
          {error}
        </div>
      )}

      <div className="flex gap-1 border-b border-line mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 whitespace-nowrap ${
              tab === t.key
                ? "border-gold text-gold-soft"
                : "border-transparent text-mute hover:text-zinc-300"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-3">
              Personal
            </h3>
            <Row label="Full name" value={detail.fullName} />
            <Row label="ID / Passport" value={detail.idNumber} />
            <Row label="Date of birth" value={detail.dob ? fmtDate(detail.dob) : ""} />
            <Row label="Gender" value={detail.gender} />
            <Row label="Mobile" value={detail.mobile} />
            <Row label="Email" value={detail.email} />
          </Card>
          <Card className="p-5">
            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-3">
              Location
            </h3>
            <Row label="Address" value={detail.address} />
            <Row label="City / Town" value={detail.city} />
            <Row label="Province" value={detail.province} />
            <Row label="Preferred areas" value={detail.preferredAreas} />
          </Card>
          <Card className="p-5">
            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-3">
              Availability
            </h3>
            <Row label="Availability" value={detail.availability} />
            <Row label="Shift" value={detail.shift} />
            <Row label="Employment type" value={detail.employmentType} />
            <Row label="Preferred locations" value={detail.preferredLocations} />
            <Row label="Applied for" value={detail.appliedForVacancy} />
          </Card>
          <Card className="p-5">
            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-3">
              Consent &amp; alerts
            </h3>
            <Row
              label="POPIA consent"
              value={
                detail.consentAgreed ? `Accepted ${fmtDateTime(detail.consentAt)}` : "Not accepted"
              }
            />
            <Row label="Opportunity alerts" value={detail.notifyEnabled ? "Enabled" : "Disabled"} />
            {detail.notifyEnabled && (
              <>
                <Row label="Alert grade" value={detail.notifyGrade || "Any"} />
                <Row label="Alert location" value={detail.notifyLocation || "Any"} />
                <Row label="Alert shift" value={detail.notifyShift || "Any"} />
              </>
            )}
          </Card>
        </div>
      )}

      {tab === "security" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-3">
              Security profile{" "}
              <span className="text-[#5C5C5C] normal-case font-normal">(candidate-provided)</span>
            </h3>
            <Row label="PSiRA number" value={detail.psiraNumber} />
            <Row label="PSiRA grade" value={detail.psiraGrade} />
            <Row label="Experience" value={`${detail.yearsExperience} years`} />
            <Row label="Previous employer" value={detail.previousEmployer} />
            <Row label="Previous sites" value={detail.previousSites} />
            <Row label="Reference details" value={detail.referenceDetails} />

            <div className="mt-5">
              <p className="text-[10.5px] tracking-[0.16em] uppercase text-mist font-bold mb-2">
                PSiRA verification outcome
              </p>
              {canDocs ? (
                <Select
                  value={detail.psiraStatus}
                  disabled={busy}
                  onChange={(e) => act({ action: "psira", psiraStatus: e.target.value })}
                >
                  {PSIRA_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              ) : (
                <Badge>{detail.psiraStatus}</Badge>
              )}
              <p className="text-[11px] text-mute mt-2">
                Subject to independent verification through official PSiRA processes.
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-3">
              Training &amp; qualifications
            </h3>
            {detail.qualifications.length === 0 && (
              <p className="text-mute text-[12.5px]">None listed.</p>
            )}
            <div className="space-y-2 mb-4">
              {detail.qualifications.map((q) => (
                <div key={q.id} className="border border-line rounded-md p-2.5 text-[12.5px]">
                  <div className="text-zinc-100 font-medium">
                    {q.type || "Untitled qualification"}
                  </div>
                  <div className="text-mute">
                    {q.provider}
                    {q.completionDate && ` · ${fmtDate(q.completionDate)}`}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Badge tone="soft">First aid: {detail.firstAid ? "Yes" : "No"}</Badge>
              <Badge tone="soft">Firefighting: {detail.firefighting ? "Yes" : "No"}</Badge>
            </div>
            {detail.otherTraining && (
              <p className="text-[12.5px] text-mist mt-4 leading-relaxed">
                {detail.otherTraining}
              </p>
            )}
          </Card>
        </div>
      )}

      {tab === "documents" && (
        <Card className="p-5">
          <div className="space-y-2.5">
            {detail.documents.map((d) => {
              const label = DOC_TYPES.find((t) => t.key === d.docKey)?.label ?? d.docKey;
              return (
                <div
                  key={d.docKey}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-line rounded-lg px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-[13.5px] text-white font-medium">{label}</div>
                    <div className="text-[11.5px] text-mute truncate">
                      {d.filename ?? "Not provided"}
                      {d.sizeBytes ? ` · ${bytes(d.sizeBytes)}` : ""}
                      {d.uploadedAt ? ` · ${fmtDateTime(d.uploadedAt)}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {d.hasFile && (
                      <a
                        href={`/api/admin/documents/${d.id}`}
                        className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold border border-line hover:border-gold/60 text-gold-soft rounded-md px-3 py-1.5"
                      >
                        <Download size={12} /> Download
                      </a>
                    )}
                    {canDocs ? (
                      <Select
                        value={d.status}
                        disabled={busy}
                        className="min-w-[140px] py-1.5! text-[12px]!"
                        onChange={(e) =>
                          act({ action: "document", docKey: d.docKey, status: e.target.value })
                        }
                      >
                        {DOC_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </Select>
                    ) : (
                      <Badge color={DOC_STATUS_COLORS[d.status]}>{d.status}</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {!canDocs && (
            <p className="text-[11px] text-mute mt-4 inline-flex items-center gap-1.5">
              <Lock size={11} /> Your role ({role}) has read-only access to document status.
            </p>
          )}
        </Card>
      )}

      {tab === "status" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-3">
              Recruitment status
            </h3>
            <Select
              value={detail.status}
              disabled={!canStatus || busy}
              onChange={(e) => act({ action: "status", status: e.target.value })}
            >
              {ADMIN_STATUS_FLOW.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            {!canStatus && (
              <p className="text-[11px] text-mute mt-2 inline-flex items-center gap-1.5">
                <Lock size={11} /> Your role ({role}) cannot change recruitment status.
              </p>
            )}

            <h4 className="text-[10.5px] text-mist uppercase tracking-[0.16em] font-bold mt-6 mb-3">
              History
            </h4>
            <ol className="relative border-l border-line pl-5 space-y-3.5 max-h-72 overflow-y-auto">
              {detail.history
                .slice()
                .reverse()
                .map((h, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full bg-gold ring-4 ring-panel" />
                    <p className="text-zinc-100 text-[12.5px]">{h.status}</p>
                    <p className="text-[10.5px] text-mute">
                      {h.changedBy} · {fmtDateTime(h.createdAt)}
                    </p>
                  </li>
                ))}
            </ol>
          </Card>

          <Card className="p-5">
            <h3 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-3 flex items-center gap-1.5">
              <StickyNote size={13} /> Internal notes
              <span className="text-[#5C5C5C] normal-case font-normal">
                (never shown to candidate)
              </span>
            </h3>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 mb-4">
              {detail.notes.length === 0 && (
                <p className="text-mute text-[12.5px]">No internal notes yet.</p>
              )}
              {detail.notes.map((n) => (
                <div key={n.id} className="bg-[#0A0A0C] border border-line rounded-md p-3">
                  <p className="text-zinc-300 text-[12.5px] leading-relaxed">{n.body}</p>
                  <p className="text-[10.5px] text-mute mt-1.5">
                    {n.author} · {fmtDateTime(n.createdAt)}
                  </p>
                </div>
              ))}
            </div>
            {canNotes ? (
              <div className="flex gap-2">
                <TextInput
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add an internal note…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && note.trim()) {
                      void act({ action: "note", note }).then(() => setNote(""));
                    }
                  }}
                />
                <Button
                  size="sm"
                  disabled={busy || !note.trim()}
                  onClick={() => void act({ action: "note", note }).then(() => setNote(""))}
                >
                  <Plus size={13} />
                </Button>
              </div>
            ) : (
              <p className="text-[11px] text-mute inline-flex items-center gap-1.5">
                <Lock size={11} /> Your role ({role}) cannot add notes.
              </p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

/* -------------------------------- List view -------------------------------- */

export default function CandidatesView({
  role,
  selectedId,
  setSelectedId,
}: {
  role: string;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}) {
  const [rows, setRows] = useState<AdminCandidateRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (search) p.set("q", search);
    Object.entries(filters).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    p.set("sortKey", sortKey);
    p.set("sortDir", sortDir);
    return p.toString();
  }, [search, filters, sortKey, sortDir]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/candidates?${query}`);
    const json = (await res.json()) as {
      ok: boolean;
      candidates?: AdminCandidateRow[];
      total?: number;
    };
    if (json.ok) {
      setRows(json.candidates ?? []);
      setTotal(json.total ?? 0);
    }
    setLoading(false);
  }, [query]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 220);
    return () => clearTimeout(t);
  }, [load]);

  if (selectedId) {
    return (
      <CandidateDetail
        id={selectedId}
        role={role}
        onBack={() => setSelectedId(null)}
        onChanged={() => void load()}
      />
    );
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const Th = ({ label, k }: { label: string; k?: string }) => (
    <th
      onClick={() => k && toggleSort(k)}
      className={`text-left px-3.5 py-3 text-[10px] tracking-[0.12em] uppercase text-mute font-bold whitespace-nowrap ${
        k ? "cursor-pointer select-none hover:text-gold-soft" : ""
      }`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {k && sortKey === k && (
          <ChevronDown size={11} className={sortDir === "asc" ? "rotate-180" : ""} />
        )}
      </span>
    </th>
  );

  return (
    <div className="p-5 md:p-8 max-w-[1500px]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display text-white text-[26px]">Candidate Register</h1>
          <p className="text-mute text-[13px] mt-1">
            {loading ? "Loading…" : `${rows.length} of ${total} candidates shown`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, reference, city, PSiRA no."
              className="pl-9 w-72"
            />
          </div>
          <Button
            variant={activeFilterCount ? "outline" : "dark"}
            onClick={() => setShowFilters((s) => !s)}
          >
            <Filter size={13} /> Filters
            {activeFilterCount > 0 && <Badge color="#C9A227">{activeFilterCount}</Badge>}
          </Button>
          <a
            href="/api/admin/export"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-line bg-panel text-gold-soft text-[13px] font-semibold hover:border-gold/50"
          >
            <Download size={13} /> Export CSV
          </a>
        </div>
      </div>

      {showFilters && (
        <Card className="p-4 mb-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select
              value={filters.grade}
              onChange={(e) => setFilters((f) => ({ ...f, grade: e.target.value }))}
            >
              <option value="">Any grade</option>
              {GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </Select>
            <Select
              value={filters.province}
              onChange={(e) => setFilters((f) => ({ ...f, province: e.target.value }))}
            >
              <option value="">Any province</option>
              {PROVINCES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <Select
              value={filters.psiraStatus}
              onChange={(e) => setFilters((f) => ({ ...f, psiraStatus: e.target.value }))}
            >
              <option value="">Any PSiRA status</option>
              {PSIRA_STATUSES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <Select
              value={filters.availability}
              onChange={(e) => setFilters((f) => ({ ...f, availability: e.target.value }))}
            >
              <option value="">Any availability</option>
              {AVAILABILITY_OPTS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <Select
              value={filters.shift}
              onChange={(e) => setFilters((f) => ({ ...f, shift: e.target.value }))}
            >
              <option value="">Any shift</option>
              {SHIFT_OPTS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <TextInput
              type="number"
              min="0"
              placeholder="Min. years experience"
              value={filters.minExperience}
              onChange={(e) => setFilters((f) => ({ ...f, minExperience: e.target.value }))}
            />
            <Select
              value={filters.applicationStatus}
              onChange={(e) => setFilters((f) => ({ ...f, applicationStatus: e.target.value }))}
            >
              <option value="">Any application status</option>
              {ADMIN_STATUS_FLOW.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <Select
              value={filters.documentStatus}
              onChange={(e) => setFilters((f) => ({ ...f, documentStatus: e.target.value }))}
            >
              <option value="">Any document status</option>
              {DOC_STATUSES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-[12px] text-gold mt-3 hover:underline"
            >
              Clear all filters
            </button>
          )}
        </Card>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="border-b border-line">
            <tr>
              <Th label="Candidate" k="name" />
              <Th label="Reference" />
              <Th label="Location" k="location" />
              <Th label="Grade" k="grade" />
              <Th label="PSiRA status" />
              <Th label="Experience" k="experience" />
              <Th label="Availability" />
              <Th label="Shift" />
              <Th label="Status" k="status" />
              <Th label="Applied" k="createdAt" />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className="border-b border-line-soft hover:bg-white/3 cursor-pointer transition-colors"
              >
                <td className="px-3.5 py-3">
                  <div className="text-[13px] text-white font-medium flex items-center gap-1.5">
                    {c.fullName}
                    {c.isDemo && <Badge tone="soft">DEMO</Badge>}
                  </div>
                  <div className="text-[11px] text-mute">{c.email}</div>
                </td>
                <td className="px-3.5 py-3 text-[12.5px] text-gold font-mono">{c.refNumber}</td>
                <td className="px-3.5 py-3 text-[12.5px] text-mist">
                  {[c.city, c.province].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-3.5 py-3 text-[12.5px] text-mist">{c.psiraGrade}</td>
                <td className="px-3.5 py-3">
                  <Badge tone="soft">{c.psiraStatus}</Badge>
                </td>
                <td className="px-3.5 py-3 text-[12.5px] text-mist">{c.yearsExperience} yrs</td>
                <td className="px-3.5 py-3 text-[12.5px] text-mist">{c.availability}</td>
                <td className="px-3.5 py-3 text-[12.5px] text-mist">{c.shift}</td>
                <td className="px-3.5 py-3">
                  <Badge color={STATUS_COLORS[c.status]}>{c.status}</Badge>
                </td>
                <td className="px-3.5 py-3 text-[12px] text-mute whitespace-nowrap">
                  {fmtDate(c.createdAt)}
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-16 text-mute text-[13px]">
                  No candidates match the current search and filters.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={10} className="text-center py-16">
                  <Loader2 size={18} className="animate-spin text-gold inline" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
