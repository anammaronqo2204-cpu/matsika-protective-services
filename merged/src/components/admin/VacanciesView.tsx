"use client";

import { useCallback, useEffect, useState } from "react";
import { Briefcase, Loader2, MapPin, Plus, Trash2, Users } from "lucide-react";
import { Badge, Button, Card, Field, Select, TextArea, TextInput } from "@/components/ui";
import { EMPLOYMENT_OPTS, GRADES, PROVINCES, ROLES, SHIFT_OPTS } from "@/lib/constants";
import { fmtDate } from "@/lib/format";
import type { VacancyRow } from "@/lib/types";

const BLANK = {
  title: "",
  location: "",
  province: "Gauteng",
  grade: "C",
  shift: "Both",
  employmentType: "Full-time",
  summary: "",
  requirementsText: "",
  positions: "1",
};

export default function VacanciesView({ role }: { role: string }) {
  const [rows, setRows] = useState<VacancyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canEdit = role === ROLES.SUPER || role === ROLES.RECRUITER;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/vacancies");
    const json = (await res.json()) as { ok: boolean; vacancies?: VacancyRow[] };
    if (json.ok) setRows(json.vacancies ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async () => {
    if (!form.title.trim()) {
      setError("A job title is required.");
      return;
    }
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/vacancies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, positions: Number(form.positions) || 1 }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    setBusy(false);
    if (!json.ok) setError(json.error ?? "Could not publish vacancy.");
    else {
      setForm(BLANK);
      setCreating(false);
      void load();
    }
  };

  const toggle = async (id: number, isOpen: boolean) => {
    await fetch("/api/admin/vacancies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isOpen }),
    });
    void load();
  };

  const remove = async (id: number) => {
    await fetch(`/api/admin/vacancies?id=${id}`, { method: "DELETE" });
    void load();
  };

  return (
    <div className="p-5 md:p-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-white text-[26px]">Vacancies</h1>
          <p className="text-mute text-[13px] mt-1">
            Positions published to the public careers page.
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setCreating((c) => !c)} variant={creating ? "dark" : "primary"}>
            <Plus size={14} /> {creating ? "Cancel" : "New vacancy"}
          </Button>
        )}
      </div>

      {creating && canEdit && (
        <Card className="p-6 mb-5">
          <h2 className="text-white font-semibold text-[15px] mb-4">Publish a new vacancy</h2>
          <div className="grid sm:grid-cols-2 gap-x-5">
            <Field label="Job title" required>
              <TextInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Grade C Security Officer — Corporate Park"
              />
            </Field>
            <Field label="Location">
              <TextInput
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Menlyn, Pretoria"
              />
            </Field>
            <Field label="Province">
              <Select
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
              >
                {PROVINCES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </Field>
            <Field label="Minimum grade">
              <Select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              >
                {GRADES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </Select>
            </Field>
            <Field label="Shift">
              <Select
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
              >
                {SHIFT_OPTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Employment type">
              <Select
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              >
                {EMPLOYMENT_OPTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Number of positions">
              <TextInput
                type="number"
                min="1"
                value={form.positions}
                onChange={(e) => setForm({ ...form, positions: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Summary">
            <TextArea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Describe the post, site type and duties."
            />
          </Field>
          <Field label="Requirements" hint="One requirement per line">
            <TextArea
              value={form.requirementsText}
              onChange={(e) => setForm({ ...form, requirementsText: e.target.value })}
              placeholder={"Valid PSiRA Grade C\nClear criminal record\nOwn transport"}
            />
          </Field>
          {error && <p className="text-[#E3948F] text-[12.5px] mb-3">{error}</p>}
          <Button onClick={create} disabled={busy}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Publish
            vacancy
          </Button>
        </Card>
      )}

      {loading && (
        <div className="py-20 grid place-items-center">
          <Loader2 size={20} className="animate-spin text-gold" />
        </div>
      )}

      <div className="space-y-3">
        {rows.map((v) => (
          <Card key={v.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-gold">{v.code}</span>
                  <Badge color={v.isOpen ? "#4C9A6A" : "#7A7A7A"}>
                    {v.isOpen ? "Open" : "Closed"}
                  </Badge>
                  <span className="text-[11px] text-mute">Posted {fmtDate(v.postedAt)}</span>
                </div>
                <h2 className="text-white font-semibold text-[16px] mt-2">{v.title}</h2>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 text-[12.5px] text-mist">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} className="text-gold/70" /> {v.location}, {v.province}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={12} className="text-gold/70" /> Grade {v.grade} ·{" "}
                    {v.employmentType} · {v.shift}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={12} className="text-gold/70" /> {v.positions} position
                    {v.positions === 1 ? "" : "s"}
                  </span>
                </div>
                {v.summary && (
                  <p className="text-[12.5px] text-mute leading-relaxed mt-2.5 max-w-2xl">
                    {v.summary}
                  </p>
                )}
              </div>

              {canEdit && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="dark" onClick={() => void toggle(v.id, !v.isOpen)}>
                    {v.isOpen ? "Close" : "Re-open"}
                  </Button>
                  {role === ROLES.SUPER && (
                    <Button size="sm" variant="danger" onClick={() => void remove(v.id)}>
                      <Trash2 size={13} />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
        {!loading && rows.length === 0 && (
          <Card className="p-12 text-center text-mute text-[13px]">
            No vacancies published yet.
          </Card>
        )}
      </div>
    </div>
  );
}
