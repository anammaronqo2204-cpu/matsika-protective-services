"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  Badge,
  BtnLink,
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
import { bytes, uid } from "@/lib/format";
import type { ApplicationPayload, Qualification, UploadedDoc } from "@/lib/types";

const STEPS = [
  "Personal",
  "Security Profile",
  "Training",
  "Availability",
  "Documents",
  "Consent",
  "Review",
];

const MAX_FILE_BYTES = 4 * 1024 * 1024;

function emptyPayload(vacancy: string): ApplicationPayload {
  return {
    personal: {
      fullName: "",
      idNumber: "",
      dob: "",
      gender: "",
      mobile: "",
      email: "",
      address: "",
      city: "",
      province: "",
      preferredAreas: "",
    },
    security: {
      psiraNumber: "",
      psiraGrade: "Not yet registered",
      psiraStatus: "Not yet verified",
      yearsExperience: "",
      previousEmployer: "",
      previousSites: "",
      referenceDetails: "",
    },
    training: { qualifications: [], firstAid: false, firefighting: false, other: "" },
    availability: {
      availability: "Immediately",
      shift: "Both",
      employmentType: "Full-time",
      preferredLocations: "",
      appliedForVacancy: vacancy,
    },
    documents: {},
    consent: { agreed: false },
    notify: { enabled: false, grade: "", location: "", shift: "", employmentType: "" },
  };
}

function ReviewRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-line-soft text-[13px]">
      <span className="text-mute">{label}</span>
      <span className="text-zinc-100 text-right">{value || "—"}</span>
    </div>
  );
}

export default function ApplyWizard() {
  const params = useSearchParams();
  const vacancy = params.get("vacancy") ?? "";

  const [step, setStep] = useState(1);
  const [data, setData] = useState<ApplicationPayload>(() => emptyPayload(vacancy));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [doneRef, setDoneRef] = useState<string | null>(null);

  const patch = <K extends keyof ApplicationPayload>(
    section: K,
    value: Partial<ApplicationPayload[K]>,
  ) => setData((d) => ({ ...d, [section]: { ...d[section], ...value } }));

  const validate = () => {
    setError("");
    if (step === 1) {
      const p = data.personal;
      if (!p.fullName || !p.idNumber || !p.mobile || !p.email || !p.province) {
        setError("Please complete all required personal details before continuing.");
        return false;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
    }
    if (step === 6 && !data.consent.agreed) {
      setError("You must accept the POPIA consent notice to submit your application.");
      return false;
    }
    return true;
  };

  const next = () => {
    if (validate()) {
      setStep((s) => Math.min(STEPS.length, s + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const prev = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onFile = (key: string, file: File | null) => {
    if (!file) {
      setData((d) => ({ ...d, documents: { ...d.documents, [key]: null } }));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`${file.name} is larger than 4MB. Please upload a smaller file.`);
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const base64 = result.includes(",") ? result.split(",")[1] : null;
      const doc: UploadedDoc = {
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        dataBase64: base64,
      };
      setData((d) => ({ ...d, documents: { ...d.documents, [key]: doc } }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; refNumber?: string; error?: string };
      if (!json.ok || !json.refNumber) {
        setError(json.error ?? "Submission failed. Please try again.");
      } else {
        setDoneRef(json.refNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const addQual = () =>
    patch("training", {
      qualifications: [
        ...data.training.qualifications,
        { id: uid(), type: "", provider: "", completionDate: "" } as Qualification,
      ],
    });
  const updateQual = (id: string, p: Partial<Qualification>) =>
    patch("training", {
      qualifications: data.training.qualifications.map((q) => (q.id === id ? { ...q, ...p } : q)),
    });
  const removeQual = (id: string) =>
    patch("training", {
      qualifications: data.training.qualifications.filter((q) => q.id !== id),
    });

  if (doneRef) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20">
        <Card className="p-9 text-center">
          <div className="w-14 h-14 rounded-full bg-[#4C9A6A]/15 border border-[#4C9A6A]/40 grid place-items-center mx-auto mb-5">
            <CheckCircle2 size={26} className="text-[#4C9A6A]" />
          </div>
          <h1 className="text-white font-display text-[28px] mb-2">Application received</h1>
          <p className="text-mist text-[13.5px] leading-relaxed mb-6">
            Your profile has been added to the Matsika officer talent pool. Our recruitment team
            will screen your submission and verify your documents.
          </p>
          <div className="bg-[#0A0A0C] border border-line rounded-lg py-5 mb-6">
            <div className="text-[10px] tracking-[0.22em] uppercase text-mute mb-1.5">
              Application reference
            </div>
            <div className="text-gold font-display text-[30px] tracking-wide">{doneRef}</div>
          </div>
          <p className="text-mute text-[11.5px] mb-7">
            Keep this reference safe — you will need it, together with your ID number, to track your
            application status.
          </p>
          <div className="flex flex-col gap-2">
            <BtnLink href="/careers/status">Track My Application</BtnLink>
            <BtnLink href="/" variant="ghost">
              Return Home
            </BtnLink>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <Link
        href="/careers"
        className="inline-flex items-center gap-1.5 text-mute text-[12px] mb-6 hover:text-gold"
      >
        <ArrowLeft size={13} /> Back to careers
      </Link>

      <h1 className="font-display text-white text-[32px] md:text-[40px] leading-tight">
        Officer Registration
      </h1>
      <p className="text-mute text-[13px] mt-2 mb-7">
        Step {step} of {STEPS.length} — {STEPS[step - 1]}
        {vacancy && (
          <>
            {" · "}
            <span className="text-gold-soft">Applying for {vacancy}</span>
          </>
        )}
      </p>

      <Stepper steps={STEPS} current={step} />

      {error && (
        <div className="bg-[#B5453F]/10 border border-[#B5453F]/40 text-[#E3948F] text-[12.5px] rounded-lg px-4 py-3 mb-5 flex items-start gap-2">
          <AlertCircle size={15} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      <Card className="p-6 md:p-8">
        {step === 1 && (
          <div>
            <div className="grid sm:grid-cols-2 gap-x-5">
              <Field label="Full Name" required>
                <TextInput
                  value={data.personal.fullName}
                  onChange={(e) => patch("personal", { fullName: e.target.value })}
                  placeholder="e.g. Sipho Dlamini"
                />
              </Field>
              <Field label="ID / Passport Number" required>
                <TextInput
                  value={data.personal.idNumber}
                  onChange={(e) => patch("personal", { idNumber: e.target.value })}
                  placeholder="13-digit SA ID or passport no."
                />
              </Field>
              <Field label="Date of Birth">
                <TextInput
                  type="date"
                  value={data.personal.dob}
                  onChange={(e) => patch("personal", { dob: e.target.value })}
                />
              </Field>
              <Field label="Gender">
                <Select
                  value={data.personal.gender}
                  onChange={(e) => patch("personal", { gender: e.target.value })}
                >
                  <option value="">Select…</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Prefer not to say</option>
                </Select>
              </Field>
              <Field label="Mobile Number" required>
                <TextInput
                  value={data.personal.mobile}
                  onChange={(e) => patch("personal", { mobile: e.target.value })}
                  placeholder="082 000 0000"
                />
              </Field>
              <Field label="Email Address" required>
                <TextInput
                  type="email"
                  value={data.personal.email}
                  onChange={(e) => patch("personal", { email: e.target.value })}
                  placeholder="you@example.com"
                />
              </Field>
            </div>
            <Field label="Residential Address">
              <TextArea
                value={data.personal.address}
                onChange={(e) => patch("personal", { address: e.target.value })}
                placeholder="Street address"
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-x-5">
              <Field label="City / Town">
                <TextInput
                  value={data.personal.city}
                  onChange={(e) => patch("personal", { city: e.target.value })}
                />
              </Field>
              <Field label="Province" required>
                <Select
                  value={data.personal.province}
                  onChange={(e) => patch("personal", { province: e.target.value })}
                >
                  <option value="">Select…</option>
                  {PROVINCES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Preferred Working Areas" hint="e.g. Pretoria East, Centurion">
              <TextInput
                value={data.personal.preferredAreas}
                onChange={(e) => patch("personal", { preferredAreas: e.target.value })}
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="grid sm:grid-cols-2 gap-x-5">
              <Field label="PSiRA Number" hint="Leave blank if not yet registered">
                <TextInput
                  value={data.security.psiraNumber}
                  onChange={(e) => patch("security", { psiraNumber: e.target.value })}
                />
              </Field>
              <Field label="Current PSiRA Grade">
                <Select
                  value={data.security.psiraGrade}
                  onChange={(e) => patch("security", { psiraGrade: e.target.value })}
                >
                  {GRADES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </Select>
              </Field>
              <Field label="PSiRA Status">
                <Select
                  value={data.security.psiraStatus}
                  onChange={(e) => patch("security", { psiraStatus: e.target.value })}
                >
                  {PSIRA_STATUSES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Years of Security Experience">
                <TextInput
                  type="number"
                  min="0"
                  value={data.security.yearsExperience}
                  onChange={(e) => patch("security", { yearsExperience: e.target.value })}
                />
              </Field>
              <Field label="Previous Security Employer">
                <TextInput
                  value={data.security.previousEmployer}
                  onChange={(e) => patch("security", { previousEmployer: e.target.value })}
                />
              </Field>
              <Field label="Previous Security Sites">
                <TextInput
                  value={data.security.previousSites}
                  onChange={(e) => patch("security", { previousSites: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Supervisor / Reference Details" hint="Name and contact number">
              <TextArea
                value={data.security.referenceDetails}
                onChange={(e) => patch("security", { referenceDetails: e.target.value })}
              />
            </Field>
            <div className="bg-[#0A0A0C] border border-line rounded-lg px-4 py-3 text-[11.5px] text-mute flex gap-2">
              <Info size={14} className="shrink-0 mt-0.5 text-gold" />
              PSiRA information you supply here is subject to independent verification through
              official PSiRA processes.
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] tracking-[0.16em] uppercase text-mist font-bold">
                Qualifications / Certificates
              </span>
              <Button size="sm" variant="outline" onClick={addQual} type="button">
                <Plus size={13} /> Add
              </Button>
            </div>
            {data.training.qualifications.length === 0 && (
              <p className="text-mute text-[12.5px] mb-4">No qualifications added yet.</p>
            )}
            <div className="space-y-3 mb-6">
              {data.training.qualifications.map((q) => (
                <div key={q.id} className="border border-line rounded-lg p-3.5 bg-[#0A0A0C]">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <TextInput
                      placeholder="e.g. Security Grade C"
                      value={q.type}
                      onChange={(e) => updateQual(q.id, { type: e.target.value })}
                    />
                    <TextInput
                      placeholder="Training provider"
                      value={q.provider}
                      onChange={(e) => updateQual(q.id, { provider: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <TextInput
                        type="date"
                        value={q.completionDate}
                        onChange={(e) => updateQual(q.id, { completionDate: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => removeQual(q.id)}
                        className="shrink-0 text-[#B5453F] hover:bg-[#B5453F]/10 rounded-md px-2"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 mb-6">
              <Checkbox
                checked={data.training.firstAid}
                onChange={(v) => patch("training", { firstAid: v })}
                label="First Aid certified"
              />
              <Checkbox
                checked={data.training.firefighting}
                onChange={(v) => patch("training", { firefighting: v })}
                label="Firefighting certified"
              />
            </div>
            <Field label="Other Relevant Certificates">
              <TextArea
                value={data.training.other}
                onChange={(e) => patch("training", { other: e.target.value })}
                placeholder="List any other relevant certificates"
              />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div>
            <Field label="Availability">
              <Select
                value={data.availability.availability}
                onChange={(e) => patch("availability", { availability: e.target.value })}
              >
                {AVAILABILITY_OPTS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </Field>
            <div className="grid sm:grid-cols-2 gap-x-5">
              <Field label="Shift Preference">
                <Select
                  value={data.availability.shift}
                  onChange={(e) => patch("availability", { shift: e.target.value })}
                >
                  {SHIFT_OPTS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Employment Preference">
                <Select
                  value={data.availability.employmentType}
                  onChange={(e) => patch("availability", { employmentType: e.target.value })}
                >
                  {EMPLOYMENT_OPTS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Preferred Locations" hint="Free text — searchable by our recruiters">
              <TextInput
                value={data.availability.preferredLocations}
                onChange={(e) => patch("availability", { preferredLocations: e.target.value })}
                placeholder="e.g. Pretoria, Centurion, Midrand"
              />
            </Field>
            <Field label="Applying For (optional)" hint="Leave blank for general talent pool">
              <TextInput
                value={data.availability.appliedForVacancy}
                onChange={(e) => patch("availability", { appliedForVacancy: e.target.value })}
                placeholder="Vacancy code or title"
              />
            </Field>
          </div>
        )}

        {step === 5 && (
          <div>
            <p className="text-mute text-[12.5px] mb-5 flex items-start gap-2">
              <Info size={14} className="shrink-0 mt-0.5 text-gold" />
              Documents are private and visible only to authorised Matsika recruitment staff.
              Accepted formats: PDF, JPG, PNG (max 4MB per file).
            </p>
            <div className="space-y-2.5">
              {DOC_TYPES.map((d) => {
                const doc = data.documents[d.key] ?? null;
                const status = doc ? "Uploaded" : "Missing";
                return (
                  <div
                    key={d.key}
                    className="flex items-center justify-between gap-3 border border-line rounded-lg px-4 py-3 bg-[#0A0A0C]"
                  >
                    <div className="min-w-0">
                      <div className="text-[13.5px] text-white font-medium">
                        {d.label}
                        {d.required && <span className="text-gold"> *</span>}
                      </div>
                      <div className="text-[11.5px] text-mute truncate">
                        {doc ? `${doc.filename} · ${bytes(doc.size)}` : "No file selected"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge color={DOC_STATUS_COLORS[status]}>{status}</Badge>
                      {doc && (
                        <button
                          type="button"
                          onClick={() => onFile(d.key, null)}
                          className="text-mute hover:text-[#E3948F] p-1"
                          aria-label="Remove file"
                        >
                          <X size={14} />
                        </button>
                      )}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => onFile(d.key, e.target.files?.[0] ?? null)}
                        />
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold border border-line hover:border-gold/60 text-gold-soft rounded-md px-3 py-1.5">
                          <Upload size={12} /> {doc ? "Replace" : "Upload"}
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <div className="bg-[#0A0A0C] border border-line rounded-lg p-4 mb-5 max-h-56 overflow-y-auto text-[12.5px] text-mist leading-relaxed">
              <p className="mb-2 font-semibold text-gold-soft">POPIA Privacy Notice (summary)</p>
              <p className="mb-2">
                Matsika Protective Services collects only the personal information necessary for
                recruitment, verification and potential employment purposes, in line with the
                Protection of Personal Information Act (POPIA). Your information is stored securely
                and access is restricted to authorised recruitment staff.
              </p>
              <p className="mb-2">
                Documents you upload are used solely to confirm identity, qualifications and
                PSiRA standing. We do not sell or share your information with third parties for
                marketing purposes.
              </p>
              <p>
                You may request access to, correction of, or deletion of your information at any
                time, subject to our data retention obligations.
              </p>
            </div>
            <Checkbox
              checked={data.consent.agreed}
              onChange={(v) => patch("consent", { agreed: v })}
              required
              label="I acknowledge the Matsika Protective Services privacy notice and consent to the processing of my personal information for recruitment, verification and potential employment purposes. I understand that this platform is not a PSiRA registration platform."
            />
            <div className="h-px bg-line-soft my-6" />
            <Checkbox
              checked={data.notify.enabled}
              onChange={(v) => patch("notify", { enabled: v })}
              label="Notify me when suitable security opportunities become available."
            />
            {data.notify.enabled && (
              <div className="grid sm:grid-cols-2 gap-x-5 mt-5">
                <Field label="Preferred Grade">
                  <Select
                    value={data.notify.grade}
                    onChange={(e) => patch("notify", { grade: e.target.value })}
                  >
                    <option value="">Any</option>
                    {GRADES.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Preferred Location">
                  <TextInput
                    value={data.notify.location}
                    onChange={(e) => patch("notify", { location: e.target.value })}
                  />
                </Field>
                <Field label="Shift">
                  <Select
                    value={data.notify.shift}
                    onChange={(e) => patch("notify", { shift: e.target.value })}
                  >
                    <option value="">Any</option>
                    {SHIFT_OPTS.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Employment Type">
                  <Select
                    value={data.notify.employmentType}
                    onChange={(e) => patch("notify", { employmentType: e.target.value })}
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
        )}

        {step === 7 && (
          <div className="space-y-7">
            <div>
              <h4 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-2">
                Personal
              </h4>
              <ReviewRow label="Full name" value={data.personal.fullName} />
              <ReviewRow label="ID / Passport" value={data.personal.idNumber} />
              <ReviewRow label="Mobile" value={data.personal.mobile} />
              <ReviewRow label="Email" value={data.personal.email} />
              <ReviewRow
                label="Location"
                value={[data.personal.city, data.personal.province].filter(Boolean).join(", ")}
              />
            </div>
            <div>
              <h4 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-2">
                Security profile
              </h4>
              <ReviewRow label="PSiRA number" value={data.security.psiraNumber} />
              <ReviewRow label="PSiRA grade" value={data.security.psiraGrade} />
              <ReviewRow label="PSiRA status" value={data.security.psiraStatus} />
              <ReviewRow
                label="Experience"
                value={
                  data.security.yearsExperience ? `${data.security.yearsExperience} years` : ""
                }
              />
              <ReviewRow
                label="Qualifications listed"
                value={data.training.qualifications.length}
              />
            </div>
            <div>
              <h4 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-2">
                Availability
              </h4>
              <ReviewRow label="Availability" value={data.availability.availability} />
              <ReviewRow label="Shift" value={data.availability.shift} />
              <ReviewRow label="Employment type" value={data.availability.employmentType} />
              <ReviewRow label="Applying for" value={data.availability.appliedForVacancy} />
            </div>
            <div>
              <h4 className="text-gold text-[10.5px] tracking-[0.16em] uppercase font-bold mb-2">
                Documents &amp; consent
              </h4>
              <ReviewRow
                label="Documents provided"
                value={`${Object.values(data.documents).filter(Boolean).length} of ${DOC_TYPES.length}`}
              />
              <ReviewRow
                label="POPIA consent"
                value={data.consent.agreed ? "Accepted" : "Not accepted"}
              />
              <ReviewRow
                label="Opportunity alerts"
                value={data.notify.enabled ? "Enabled" : "Disabled"}
              />
            </div>
            <p className="text-mute text-[11.5px]">
              By submitting, you confirm the information provided is accurate to the best of your
              knowledge. False information may disqualify you from consideration.
            </p>
          </div>
        )}
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="ghost" onClick={prev} disabled={step === 1} type="button">
          <ChevronLeft size={15} /> Back
        </Button>
        {step < STEPS.length ? (
          <Button onClick={next} type="button">
            Continue <ChevronRight size={15} />
          </Button>
        ) : (
          <Button onClick={submit} disabled={submitting} type="button">
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
    </div>
  );
}
