"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Filter, Loader2, Search } from "lucide-react";
import { Badge, Button, Card, Select, TextInput } from "@/components/ui";
import {
  ADMIN_STATUS_FLOW,
  AVAILABILITY_OPTS,
  DOC_STATUSES,
  GRADES,
  PROVINCES,
  PSIRA_STATUSES,
  SHIFT_OPTS,
  STATUS_COLORS,
} from "@/lib/constants";
import type { AppCandidate } from "@/lib/serialize";

const emptyFilters = {
  grade: "",
  province: "",
  psiraStatus: "",
  availability: "",
  shift: "",
  minExperience: "",
  applicationStatus: "",
  documentStatus: "",
};

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
};

export default function CandidateList() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<AppCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/admin/candidates")
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = await r.json();
        setCandidates(data.candidates || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setFilter = (k: string, v: string) => setFilters((f) => ({ ...f, [k]: v }));
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filtered = useMemo(() => {
    let rows = candidates.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const hay = [
          c.personal.fullName,
          c.refNumber,
          c.personal.city,
          c.personal.province,
          c.security.psiraNumber,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.grade && c.security.psiraGrade !== filters.grade) return false;
      if (filters.province && c.personal.province !== filters.province) return false;
      if (filters.psiraStatus && c.security.psiraStatus !== filters.psiraStatus) return false;
      if (filters.availability && c.availability.availability !== filters.availability) return false;
      if (filters.shift && c.availability.shift !== filters.shift) return false;
      if (filters.minExperience && Number(c.security.yearsExperience || 0) < Number(filters.minExperience)) return false;
      if (filters.applicationStatus && c.status !== filters.applicationStatus) return false;
      if (filters.documentStatus) {
        if (!Object.values(c.documents).some((d) => d.status === filters.documentStatus)) return false;
      }
      return true;
    });
    rows.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      switch (sortKey) {
        case "name": av = a.personal.fullName; bv = b.personal.fullName; break;
        case "location": av = a.personal.city; bv = b.personal.city; break;
        case "grade": av = a.security.psiraGrade; bv = b.security.psiraGrade; break;
        case "experience": av = Number(a.security.yearsExperience || 0); bv = Number(b.security.yearsExperience || 0); break;
        case "status": av = a.status; bv = b.status; break;
        default: av = a.createdAt; bv = b.createdAt;
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [candidates, search, filters, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const Th = ({ label, k }: { label: string; k?: string }) => (
    <th
      className="cursor-pointer select-none whitespace-nowrap px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-dim"
      onClick={() => k && toggleSort(k)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {k && sortKey === k && (
          <ChevronDown size={11} className={sortDir === "asc" ? "rotate-180" : ""} />
        )}
      </span>
    </th>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 size={22} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-dim">
          Showing <span className="font-bold text-cream">{filtered.length}</span> of{" "}
          <span className="font-bold text-cream">{candidates.length}</span> candidates
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, ref, location, PSiRA no."
              className="w-64 pl-9"
            />
          </div>
          <Button variant={activeFilterCount ? "outline" : "dark"} onClick={() => setShowFilters((s) => !s)}>
            <Filter size={13} /> Filters
            {activeFilterCount > 0 && <Badge color="#C9A227">{activeFilterCount}</Badge>}
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-5 p-4">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <Select value={filters.grade} onChange={(e) => setFilter("grade", e.target.value)}>
              <option value="">Any Grade</option>
              {GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </Select>
            <Select value={filters.province} onChange={(e) => setFilter("province", e.target.value)}>
              <option value="">Any Province</option>
              {PROVINCES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <Select value={filters.psiraStatus} onChange={(e) => setFilter("psiraStatus", e.target.value)}>
              <option value="">Any PSiRA Status</option>
              {PSIRA_STATUSES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <Select value={filters.availability} onChange={(e) => setFilter("availability", e.target.value)}>
              <option value="">Any Availability</option>
              {AVAILABILITY_OPTS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <Select value={filters.shift} onChange={(e) => setFilter("shift", e.target.value)}>
              <option value="">Any Shift</option>
              {SHIFT_OPTS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <TextInput
              type="number"
              min="0"
              placeholder="Min. years experience"
              value={filters.minExperience}
              onChange={(e) => setFilter("minExperience", e.target.value)}
            />
            <Select value={filters.applicationStatus} onChange={(e) => setFilter("applicationStatus", e.target.value)}>
              <option value="">Any Application Status</option>
              {ADMIN_STATUS_FLOW.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <Select value={filters.documentStatus} onChange={(e) => setFilter("documentStatus", e.target.value)}>
              <option value="">Any Document Status</option>
              {DOC_STATUSES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters(emptyFilters)}
              className="mt-3 text-[12px] text-gold hover:underline"
            >
              Clear all filters
            </button>
          )}
        </Card>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-line">
            <tr>
              <Th label="Candidate" k="name" />
              <Th label="Application No." />
              <Th label="Location" k="location" />
              <Th label="Grade" k="grade" />
              <Th label="PSiRA Status" />
              <Th label="Experience" k="experience" />
              <Th label="Availability" />
              <Th label="Status" k="status" />
              <Th label="Date Applied" k="createdAt" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/admin/candidates/${c.id}`)}
                className="cursor-pointer border-b border-line transition-colors hover:bg-panel2"
              >
                <td className="px-3.5 py-3">
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-cream">
                    {c.personal.fullName}
                    {c.demo && <Badge tone="soft">DEMO</Badge>}
                  </div>
                  <div className="text-[11px] text-dim">{c.personal.email}</div>
                </td>
                <td className="px-3.5 py-3 font-mono text-[12.5px] text-gold">{c.refNumber}</td>
                <td className="px-3.5 py-3 text-[12.5px] text-mist">
                  {c.personal.city}
                  {c.personal.city && ", "}
                  {c.personal.province}
                </td>
                <td className="px-3.5 py-3 text-[12.5px] text-mist">{c.security.psiraGrade}</td>
                <td className="px-3.5 py-3">
                  <Badge tone="soft">{c.security.psiraStatus}</Badge>
                </td>
                <td className="px-3.5 py-3 text-[12.5px] text-mist">{c.security.yearsExperience || 0} yrs</td>
                <td className="px-3.5 py-3 text-[12.5px] text-mist">{c.availability.availability}</td>
                <td className="px-3.5 py-3">
                  <Badge color={STATUS_COLORS[c.status] || "#C9A227"}>{c.status}</Badge>
                </td>
                <td className="whitespace-nowrap px-3.5 py-3 text-[12px] text-dim">{fmtDate(c.createdAt)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-14 text-center text-[13px] text-[#5C5C5C]">
                  No candidates match the current search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
