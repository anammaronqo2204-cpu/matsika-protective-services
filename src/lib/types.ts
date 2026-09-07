export type Qualification = {
  id: string;
  type: string;
  provider: string;
  completionDate: string;
};

export type UploadedDoc = {
  filename: string;
  mimeType: string;
  size: number;
  dataBase64: string | null;
};

export type ApplicationPayload = {
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
    qualifications: Qualification[];
    firstAid: boolean;
    firefighting: boolean;
    other: string;
  };
  availability: {
    availability: string;
    shift: string;
    employmentType: string;
    preferredLocations: string;
    appliedForVacancy: string;
  };
  documents: Record<string, UploadedDoc | null>;
  consent: { agreed: boolean };
  notify: {
    enabled: boolean;
    grade: string;
    location: string;
    shift: string;
    employmentType: string;
  };
};

export type DocRow = {
  id: number;
  docKey: string;
  status: string;
  filename: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  hasFile: boolean;
  uploadedAt: string | null;
};

export type PublicStatusResult = {
  refNumber: string;
  fullName: string;
  province: string;
  createdAt: string;
  status: string;
  publicStatus: string;
  documents: { key: string; label: string; status: string }[];
  history: { status: string; publicStatus: string; createdAt: string }[];
};

export type AdminCandidateRow = {
  id: string;
  refNumber: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  province: string;
  psiraGrade: string;
  psiraStatus: string;
  yearsExperience: number;
  availability: string;
  shift: string;
  employmentType: string;
  status: string;
  isDemo: boolean;
  createdAt: string;
};

export type AdminCandidateDetail = AdminCandidateRow & {
  idNumber: string;
  dob: string;
  gender: string;
  address: string;
  preferredAreas: string;
  psiraNumber: string;
  previousEmployer: string;
  previousSites: string;
  referenceDetails: string;
  qualifications: Qualification[];
  firstAid: boolean;
  firefighting: boolean;
  otherTraining: string;
  preferredLocations: string;
  appliedForVacancy: string;
  consentAgreed: boolean;
  consentAt: string | null;
  notifyEnabled: boolean;
  notifyGrade: string;
  notifyLocation: string;
  notifyShift: string;
  notifyEmploymentType: string;
  documents: DocRow[];
  history: { status: string; changedBy: string; createdAt: string }[];
  notes: { id: number; body: string; author: string; createdAt: string }[];
};

export type SessionInfo = {
  id: number;
  username: string;
  name: string;
  role: string;
};

export type VacancyRow = {
  id: number;
  code: string;
  title: string;
  location: string;
  province: string;
  grade: string;
  shift: string;
  employmentType: string;
  summary: string;
  requirements: string[];
  positions: number;
  isOpen: boolean;
  postedAt: string;
};

export type LeadRow = {
  id: number;
  reference: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  sector: string;
  province: string;
  siteAddress: string;
  urgency: string;
  message: string;
  status: string;
  createdAt: string;
};
