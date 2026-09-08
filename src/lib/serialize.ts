import type { CandidateRow } from "@/db/schema";
import { DOC_TYPES } from "./constants";

/* Application-shaped candidate (matches the public web app / admin UI shape) */

export interface AppCandidate {
  id: string;
  refNumber: string;
  demo: boolean;
  createdAt: string;
  personal: {
    fullName: string;
    idNumber: string;
    dob: string;
    gender: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    province: string;
    preferredAreas: string;
  };
  security: {
    psiraNumber: string;
    psiraGrade: string;
    psiraStatus: string;
    yearsExperience: string;
    previousEmployer: string;
    previousSites: string;
    referenceDetails: string;
  };
  training: {
    qualifications: {
      id: string;
      type: string;
      provider: string;
      completionDate: string;
    }[];
    firstAid: boolean;
    firefighting: boolean;
    other: string;
  };
  availability: {
    availability: string;
    shift: string;
    employmentType: string;
    preferredLocations: string;
  };
  documents: Record<
    string,
    { status: string; filename: string | null; uploadedAt: string | null }
  >;
  consent: { agreed: boolean; timestamp: string | null };
  notify: {
    enabled: boolean;
    grade: string;
    location: string;
    shift: string;
    employmentType: string;
  };
  status: string;
  statusHistory: { status: string; timestamp: string; by: string }[];
  internalNotes: { text: string; timestamp: string; by: string }[];
}

export function emptyDocs() {
  const d: AppCandidate["documents"] = {};
  DOC_TYPES.forEach((t) => {
    d[t.key] = { status: "Missing", filename: null, uploadedAt: null };
  });
  return d;
}

export function newCandidate(): AppCandidate {
  return {
    id: "",
    refNumber: "",
    demo: false,
    createdAt: new Date().toISOString(),
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
    },
    documents: emptyDocs(),
    consent: { agreed: false, timestamp: null },
    notify: { enabled: false, grade: "", location: "", shift: "", employmentType: "" },
    status: "New",
    statusHistory: [{ status: "New", timestamp: new Date().toISOString(), by: "System" }],
    internalNotes: [],
  };
}

const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);

export function rowToCandidate(r: CandidateRow): AppCandidate {
  return {
    id: r.id,
    refNumber: r.refNumber,
    demo: r.demo,
    createdAt: iso(r.createdAt) || new Date().toISOString(),
    personal: {
      fullName: r.fullName,
      idNumber: r.idNumber,
      dob: r.dob || "",
      gender: r.gender || "",
      mobile: r.mobile,
      email: r.email,
      address: r.address || "",
      city: r.city || "",
      province: r.province,
      preferredAreas: r.preferredAreas || "",
    },
    security: {
      psiraNumber: r.psiraNumber || "",
      psiraGrade: r.psiraGrade,
      psiraStatus: r.psiraStatus,
      yearsExperience: String(r.yearsExperience),
      previousEmployer: r.previousEmployer || "",
      previousSites: r.previousSites || "",
      referenceDetails: r.referenceDetails || "",
    },
    training: {
      qualifications: r.qualifications || [],
      firstAid: r.firstAid,
      firefighting: r.firefighting,
      other: r.otherCertificates || "",
    },
    availability: {
      availability: r.availability,
      shift: r.shift,
      employmentType: r.employmentType,
      preferredLocations: r.preferredLocations || "",
    },
    documents: { ...emptyDocs(), ...(r.documents || {}) },
    consent: {
      agreed: r.consentAgreed,
      timestamp: iso(r.consentTimestamp),
    },
    notify: {
      enabled: r.notifyEnabled,
      grade: r.notifyGrade || "",
      location: r.notifyLocation || "",
      shift: r.notifyShift || "",
      employmentType: r.notifyEmploymentType || "",
    },
    status: r.status,
    statusHistory: r.statusHistory || [],
    internalNotes: r.internalNotes || [],
  };
}

export function candidateToRow(c: AppCandidate): Omit<CandidateRow, "id" | "seq"> {
  return {
    refNumber: c.refNumber,
    createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
    demo: !!c.demo,
    fullName: c.personal.fullName,
    idNumber: c.personal.idNumber,
    dob: c.personal.dob || null,
    gender: c.personal.gender || null,
    mobile: c.personal.mobile,
    email: c.personal.email,
    address: c.personal.address || null,
    city: c.personal.city || null,
    province: c.personal.province,
    preferredAreas: c.personal.preferredAreas || null,
    psiraNumber: c.security.psiraNumber || null,
    psiraGrade: c.security.psiraGrade,
    psiraStatus: c.security.psiraStatus,
    yearsExperience: Number(c.security.yearsExperience) || 0,
    previousEmployer: c.security.previousEmployer || null,
    previousSites: c.security.previousSites || null,
    referenceDetails: c.security.referenceDetails || null,
    qualifications: c.training.qualifications || [],
    firstAid: !!c.training.firstAid,
    firefighting: !!c.training.firefighting,
    otherCertificates: c.training.other || null,
    availability: c.availability.availability,
    shift: c.availability.shift,
    employmentType: c.availability.employmentType,
    preferredLocations: c.availability.preferredLocations || null,
    documents: c.documents || {},
    notifyEnabled: !!c.notify.enabled,
    notifyGrade: c.notify.grade || null,
    notifyLocation: c.notify.location || null,
    notifyShift: c.notify.shift || null,
    notifyEmploymentType: c.notify.employmentType || null,
    consentAgreed: !!c.consent.agreed,
    consentTimestamp: c.consent.timestamp ? new Date(c.consent.timestamp) : null,
    status: c.status,
    statusHistory: c.statusHistory || [],
    internalNotes: c.internalNotes || [],
  };
}
