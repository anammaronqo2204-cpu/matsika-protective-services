"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Info,
  Loader2,
  Plus,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Field,
  Select,
  Stepper,
  TextArea,
  TextInput,
} from "@/components/ui";
import {
  AVAILABILITY_OPTS,
  DOC_STATUS_COLORS,
  DOC_TYPES,
  EMPLOYMENT_OPTS,
  GRADES,
  PROVINCES,
  PSIRA_STATUSES,
  SHIFT_OPTS,
} from "@/lib/constants";
import { newCandidate, type AppCandidate } from "@/lib/serialize";

const REG_STEPS = [
  "Personal",
  "Security Profile",
  "Training",
  "Availability",
  "Documents",
  "Consent",
  "Review",
];

type StepProps = {
  cand: AppCandidate;
  update: (patch: Partial<AppCandidate>) => void;
};

function StepPersonal({ cand, update }: StepProps) {
  const p = cand.personal;
  const set = (patch: Partial<AppCandidate["personal"]>) =>
    update({ personal: { ...p, ...patch } });
  return (
    <div>
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="Full Name" required>
          <TextInput value={p.fullName} onChange={(e) => set({ fullName: e.target.value })} placeholder="e.g. Sipho Dlamini" />
        </Field>
        <Field label="ID / Passport Number" required>
          <TextInput value={p.idNumber} onChange={(e) => set({ idNumber: e.target.value })} placeholder="13-digit SA ID or passport no." />
        </Field>
        <Field label="Date of Birth">
          <TextInput type="date" value={p.dob} onChange={(e) => set({ dob: e.target.value })} />
        </Field>
        <Field label="Gender">
          <Select value={p.gender} onChange={(e) => set({ gender: e.target.value })}>
            <option value="">Select…</option>
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
          </Select>
        </Field>
        <Field label="Mobile Number" required>
          <TextInput value={p.mobile} onChange={(e) => set({ mobile: e.target.value })} placeholder="082 000 0000" />
        </Field>
        <Field label="Email Address" required>
          <TextInput type="email" value={p.email} onChange={(e) => set({ email: e.target.value })} placeholder="you@example.com" />
        </Field>
      </div>
      <Field label="Residential Address">
        <TextArea value={p.address} onChange={(e) => set({ address: e.target.value })} placeholder="Street address" />
      </Field>
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="City / Town">
          <TextInput value={p.city} onChange={(e) => set({ city: e.target.value })} />
        </Field>
        <Field label="Province" required>
          <Select value={p.province} onChange={(e) => set({ province: e.target.value })}>
            <option value="">Select…</option>
            {PROVINCES.map((pr) => (
              <option key={pr}>{pr}</option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Preferred Working Areas" hint="e.g. Pretoria East, Centurion">
        <TextInput value={p.preferredAreas} onChange={(e) => set({ preferredAreas: e.target.value })} />
      </Field>
    </div>
  );
}

function StepSecurity({ cand, update }: StepProps) {
  const s = cand.security;
  const set = (patch: Partial<AppCandidate["security"]>) =>
    update({ security: { ...s, ...patch } });
  return (
    <div>
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="PSiRA Number" hint="Leave blank if not yet registered">
          <TextInput value={s.psiraNumber} onChange={(e) => set({ psiraNumber: e.target.value })} />
        </Field>
        <Field label="Current PSiRA Grade">
          <Select value={s.psiraGrade} onChange={(e) => set({ psiraGrade: e.target.value })}>
            {GRADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </Select>
        </Field>
        <Field label="PSiRA Status">
          <Select value={s.psiraStatus} onChange={(e) => set({ psiraStatus: e.target.value })}>
            {PSIRA_STATUSES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </Select>
        </Field>
        <Field label="Years of Security Experience">
          <TextInput type="number" min="0" value={s.yearsExperience} onChange={(e) => set({ yearsExperience: e.target.value })} />
        </Field>
        <Field label="Previous Security Employer">
          <TextInput value={s.previousEmployer} onChange={(e) => set({ previousEmployer: e.target.value })} />
        </Field>
        <Field label="Previous Security Sites">
          <TextInput value={s.previousSites} onChange={(e) => set({ previousSites: e.target.value })} />
        </Field>
      </div>
      <Field label="Supervisor / Reference Details" hint="Name and contact number">
        <TextArea value={s.referenceDetails} onChange={(e) => set({ referenceDetails: e.target.value })} />
      </Field>
      <div className="flex gap-2 rounded-lg border border-line2 bg-coal px-4 py-3 text-[11.5px] text-dim">
        <Info size={14} className="mt-0.5 shrink-0 text-gold" />
        PSiRA information you supply here is subject to independent verification through official
        PSiRA processes.
      </div>
    </div>
  );
}

function StepTraining({ cand, update }: StepProps) {
  const t = cand.training;
  const set = (patch: Partial<AppCandidate["training"]>) =>
    update({ training: { ...t, ...patch } });
  const add = () =>
    set({ qualifications: [...t.qualifications, { id: crypto.randomUUID(), type: "", provider: "", completionDate: "" }] });
  const upd = (id: string, patch: Partial<AppCandidate["training"]["qualifications"][number]>) =>
    set({ qualifications: t.qualifications.map((q) => (q.id === id ? { ...q, ...patch } : q)) });
  const remove = (id: string) =>
    set({ qualifications: t.qualifications.filter((q) => q.id !== id) });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">
          Qualifications / Certificates
        </span>
        <Button size="sm" variant="outline" onClick={add}>
          <Plus size={13} /> Add
        </Button>
      </div>
      {t.qualifications.length === 0 && (
        <p className="mb-4 text-[12.5px] text-[#5C5C5C]">No qualifications added yet.</p>
      )}
      <div className="mb-5 space-y-3">
        {t.qualifications.map((q) => (
          <div key={q.id} className="rounded-lg border border-line2 bg-coal p-3.5">
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput placeholder="e.g. Security Grade C" value={q.type} onChange={(e) => upd(q.id, { type: e.target.value })} />
              <TextInput placeholder="Training provider" value={q.provider} onChange={(e) => upd(q.id, { provider: e.target.value })} />
              <div className="flex gap-2">
                <TextInput type="date" value={q.completionDate} onChange={(e) => upd(q.id, { completionDate: e.target.value })} />
                <button
                  onClick={() => remove(q.id)}
                  className="shrink-0 rounded-md px-2 text-danger hover:bg-danger/10"
                  aria-label="Remove qualification"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-5 flex gap-6">
        <Checkbox checked={t.firstAid} onChange={(v) => set({ firstAid: v })} label="First Aid certified" />
        <Checkbox checked={t.firefighting} onChange={(v) => set({ firefighting: v })} label="Firefighting certified" />
      </div>
      <Field label="Other Relevant Certificates">
        <TextArea value={t.other} onChange={(e) => set({ other: e.target.value })} placeholder="List any other relevant certificates" />
      </Field>
    </div>
  );
}

function StepAvailability({ cand, update }: StepProps) {
  const a = cand.availability;
  const set = (patch: Partial<AppCandidate["availability"]>) =>
    update({ availability: { ...a, ...patch } });
  return (
    <div>
      <Field label="Availability">
        <Select value={a.availability} onChange={(e) => set({ availability: e.target.value })}>
          {AVAILABILITY_OPTS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </Select>
      </Field>
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field label="Shift Preference">
          <Select value={a.shift} onChange={(e) => set({ shift: e.target.value })}>
            {SHIFT_OPTS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
        <Field label="Employment Preference">
          <Select value={a.employmentType} onChange={(e) => set({ employmentType: e.target.value })}>
            {EMPLOYMENT_OPTS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Preferred Locations" hint="Free text — searchable by recruiters">
        <TextInput
          value={a.preferredLocations}
          onChange={(e) => set({ preferredLocations: e.target.value })}
          placeholder="e.g. Pretoria, Centurion, Midrand"
        />
      </Field>
    </div>
  );
}

function StepDocuments({ cand, update }: StepProps) {
  const docs = cand.documents;
  const setDoc = (key: string, file: File | null) =>
    update({
      documents: {
        ...docs,
        [key]: file
          ? { status: "Uploaded", filename: file.name, uploadedAt: new Date().toISOString() }
          : { status: "Missing", filename: null, uploadedAt: null },
      },
    });
  return (
    <div>
      <p className="mb-5 flex items-start gap-2 text-[12.5px] text-dim">
        <Info size={14} className="mt-0.5 shrink-0 text-gold" />
        Documents are private and only visible to authorised Matsika recruitment staff. Upload
        references are recorded here; originals are verified in person or via secure channels.
      </p>
      <div className="space-y-2.5">
        {DOC_TYPES.map((d) => {
          const doc = docs[d.key];
          return (
            <div
              key={d.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-line2 bg-coal px-4 py-3"
            >
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium text-cream">{d.label}</div>
                <div className="truncate text-[11.5px] text-dim">{doc.filename || "No file selected"}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge color={DOC_STATUS_COLORS[doc.status] || "#8F8F8F"}>{doc.status}</Badge>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setDoc(d.key, e.target.files?.[0] || null)}
                  />
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-line2 px-3 py-1.5 text-[12px] font-semibold text-gold-pale transition-colors hover:border-gold/60">
                    <Upload size={12} /> {doc.filename ? "Replace" : "Upload"}
                  </span>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepConsent({ cand, update }: StepProps) {
  const consent = cand.consent;
  const notify = cand.notify;
  return (
    <div>
      <div className="mb-5 max-h-52 overflow-y-auto rounded-lg border border-line2 bg-coal p-4 text-[12.5px] leading-relaxed text-mist">
        <p className="mb-2 font-semibold text-gold-pale">POPIA Privacy Notice (summary)</p>
        <p className="mb-2">
          Matsika Protective Services collects only the personal information necessary for
          recruitment, verification and potential employment purposes, in line with the Protection
          of Personal Information Act (POPIA). Your information is stored securely and access is
          restricted to authorised recruitment staff.
        </p>
        <p>
          You may request access to, correction of, or deletion of your information at any time,
          subject to our data retention obligations. Full policies are linked in the footer.
        </p>
      </div>
      <Checkbox
        checked={consent.agreed}
        onChange={(v) => update({ consent: { ...consent, agreed: v } })}
        required
        label="I acknowledge Matsika Protective Services' privacy notice and consent to the processing of my personal information for recruitment, verification and potential employment purposes. I understand that this platform is not a PSiRA registration platform."
      />
      <div className="my-6 h-px bg-line" />
      <Checkbox
        checked={notify.enabled}
        onChange={(v) => update({ notify: { ...notify, enabled: v } })}
        label="Notify me when suitable security opportunities become available."
      />
      {notify.enabled && (
        <div className="mt-4 grid gap-x-5 sm:grid-cols-2">
          <Field label="Preferred Grade">
            <Select
              value={notify.grade}
              onChange={(e) => update({ notify: { ...notify, grade: e.target.value } })}
            >
              <option value="">Any</option>
              {GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </Select>
          </Field>
          <Field label="Preferred Location">
            <TextInput
              value={notify.location}
              onChange={(e) => update({ notify: { ...notify, location: e.target.value } })}
            />
          </Field>
          <Field label="Shift">
            <Select
              value={notify.shift}
              onChange={(e) => update({ notify: { ...notify, shift: e.target.value } })}
            >
              <option value="">Any</option>
              {SHIFT_OPTS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </Select>
          </Field>
          <Field label="Employment Type">
            <Select
              value={notify.employmentType}
              onChange={(e) => update({ notify: { ...notify, employmentType: e.target.value } })}
            >
              <option value="">Any</option>
              {EMPLOYMENT_OPTS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </Select>
          </Field>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-1.5 text-[13px]">
      <span className="text-dim">{label}</span>
      <span className="text-right text-cream">{value || "—"}</span>
    </div>
  );
}

function StepReview({ cand }: StepProps) {
  const uploadedCount = Object.values(cand.documents).filter((d) => d.status !== "Missing").length;
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Personal</h4>
        <ReviewRow label="Full name" value={cand.personal.fullName} />
        <ReviewRow label="ID / Passport" value={cand.personal.idNumber} />
        <ReviewRow label="Mobile" value={cand.personal.mobile} />
        <ReviewRow label="Email" value={cand.personal.email} />
        <ReviewRow label="Province" value={cand.personal.province} />
      </div>
      <div>
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Security Profile</h4>
        <ReviewRow label="PSiRA grade" value={cand.security.psiraGrade} />
        <ReviewRow label="PSiRA status" value={cand.security.psiraStatus} />
        <ReviewRow label="Experience" value={cand.security.yearsExperience ? `${cand.security.yearsExperience} years` : ""} />
      </div>
      <div>
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Availability</h4>
        <ReviewRow label="Availability" value={cand.availability.availability} />
        <ReviewRow label="Shift" value={cand.availability.shift} />
        <ReviewRow label="Employment type" value={cand.availability.employmentType} />
      </div>
      <div>
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Documents</h4>
        <ReviewRow label="Documents provided" value={`${uploadedCount} of ${DOC_TYPES.length}`} />
      </div>
      <div>
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Consent</h4>
        <ReviewRow label="POPIA consent" value={cand.consent.agreed ? "Accepted" : "Not accepted"} />
        <ReviewRow label="Opportunity alerts" value={cand.notify.enabled ? "Enabled" : "Disabled"} />
      </div>
      <p className="text-[11.5px] text-[#5C5C5C]">
        By submitting, you confirm the information provided is accurate to the best of your knowledge.
      </p>
    </div>
  );
}

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [cand, setCand] = useState<AppCandidate>(() => newCandidate());
  const [submitting, setSubmitting] = useState(false);
  const [doneRef, setDoneRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");

  const update = (patch: Partial<AppCandidate>) => setCand((c) => ({ ...c, ...patch }));

  const validateStep = () => {
    setError("");
    if (step === 1) {
      const p = cand.personal;
      if (!p.fullName || !p.idNumber || !p.mobile || !p.email || !p.province) {
        setError("Please complete all required personal details before continuing.");
        return false;
      }
    }
    if (step === 6 && !cand.consent.agreed) {
      setError("You must accept the POPIA consent notice to submit your application.");
      return false;
    }
    return true;
  };

  const next = () => {
    if (validateStep()) {
      setStep((s) => Math.min(REG_STEPS.length, s + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const prev = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate: cand,
          consentTimestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed. Please try again.");
      setDoneRef(data.refNumber);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  const copyRef = async () => {
    if (!doneRef) return;
    try {
      await navigator.clipboard.writeText(doneRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const stepTitle = useMemo(() => REG_STEPS[step - 1], [step]);

  if (doneRef) {
    return (
      <div className="flex min-h-screen flex-col bg-ink">
        <SiteNav />
        <div className="flex flex-1 items-center justify-center px-6 py-20">
          <Card className="w-full max-w-md p-9 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-ok/40 bg-ok/15">
              <CheckCircle2 size={26} className="text-ok" />
            </div>
            <h2 className="font-display text-[26px] font-semibold text-cream">
              Application Received
            </h2>
            <p className="mb-6 mt-2 text-[13px] leading-relaxed text-mist">
              Welcome to the Matsika talent pool, {cand.personal.fullName.split(" ")[0]}. Our
              recruitment team will review your profile, verify your PSiRA information and screen
              your documents.
            </p>
            <div className="mb-3 rounded-lg border border-gold/30 bg-gold/5 py-4">
              <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-dim">
                Application Reference
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="font-display text-[28px] font-bold tracking-wide text-gold">
                  {doneRef}
                </span>
                <button onClick={copyRef} className="text-dim transition-colors hover:text-gold" aria-label="Copy reference">
                  <Copy size={14} />
                </button>
              </div>
              {copied && <div className="mt-1 text-[10.5px] text-ok">Copied to clipboard</div>}
            </div>
            <p className="mb-6 text-[11px] text-faint">
              Keep this reference number safe — use it with your ID number to check your status.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/status">
                <Button className="w-full">Check Application Status</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full">Return to Home</Button>
              </Link>
            </div>
          </Card>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <SiteNav />
      <div className="mx-auto w-full max-w-2xl px-5 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[12px] text-dim transition-colors hover:text-gold"
        >
          <ArrowLeft size={13} /> Back to home
        </Link>
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/30 bg-gold/10">
            <Shield size={19} className="text-gold" />
          </div>
          <div>
            <h1 className="font-display text-[28px] font-semibold text-cream">Officer Registration</h1>
            <p className="text-[12.5px] text-dim">
              Step {step} of {REG_STEPS.length} — {stepTitle}
            </p>
          </div>
        </div>

        <Stepper steps={REG_STEPS} current={step} />

        {(error || serverError) && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-[12.5px] text-[#E3948F]">
            <AlertCircle size={15} className="shrink-0" /> {error || serverError}
          </div>
        )}

        <Card className="p-6 md:p-7">
          {step === 1 && <StepPersonal cand={cand} update={update} />}
          {step === 2 && <StepSecurity cand={cand} update={update} />}
          {step === 3 && <StepTraining cand={cand} update={update} />}
          {step === 4 && <StepAvailability cand={cand} update={update} />}
          {step === 5 && <StepDocuments cand={cand} update={update} />}
          {step === 6 && <StepConsent cand={cand} update={update} />}
          {step === 7 && <StepReview cand={cand} update={update} />}
        </Card>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={prev} disabled={step === 1}>
            <ChevronLeft size={15} /> Back
          </Button>
          {step < REG_STEPS.length ? (
            <Button onClick={next}>
              Continue <ChevronRight size={15} />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  Submit Application <Check size={15} />
                </>
              )}
            </Button>
          )}
        </div>

        <p className="mt-8 flex items-start gap-2 rounded-lg border border-line bg-coal px-4 py-3 text-[11px] leading-relaxed text-dim">
          <Info size={13} className="mt-0.5 shrink-0 text-gold" />
          Registration on this platform does not constitute registration with PSiRA and does not
          guarantee employment or deployment. PSiRA status is independently verified where required.
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}
