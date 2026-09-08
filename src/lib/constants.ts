/* Shared domain constants for Matsika Protective Services */

export const COMPANY = {
  name: "Matsika Protective Services",
  legal: "Matsika Legacy Holdings (Pty) Ltd",
  tagline: "Protecting Today. Securing Tomorrow.",
  email: "info@matsikaprotective.co.za",
  recruitmentEmail: "careers@matsikaprotective.co.za",
  phone: "011 786 2400",
  emergency: "0860 628 747",
  emergencyDisplay: "0860 MATSIKA",
  address: "12 Empire Road, Parktown, Johannesburg, 2193",
  hours: "24/7 Emergency Response · Mon–Fri 08:00–17:00 (Head Office)",
};

export const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

export const GRADES = ["E", "D", "C", "B", "A", "Not yet registered"];
export const PSIRA_STATUSES = [
  "Not yet verified",
  "Candidate claims active",
  "Verification pending",
  "Verified",
  "Expired",
];
export const AVAILABILITY_OPTS = [
  "Immediately",
  "Within 2 weeks",
  "Within 1 month",
  "Not currently available",
];
export const SHIFT_OPTS = ["Day", "Night", "Both"];
export const EMPLOYMENT_OPTS = ["Full-time", "Part-time", "Contract"];

export const DOC_TYPES = [
  { key: "idDocument", label: "ID Document" },
  { key: "cv", label: "CV" },
  { key: "psiraProof", label: "PSiRA Proof" },
  { key: "trainingCert", label: "Security Training Certificate" },
  { key: "firstAidCert", label: "First Aid Certificate" },
  { key: "firefightingCert", label: "Firefighting Certificate" },
  { key: "proofOfAddress", label: "Proof of Address" },
  { key: "other", label: "Other Document" },
];
export const DOC_STATUSES = [
  "Missing",
  "Uploaded",
  "Under Review",
  "Verified",
  "Rejected",
  "Expired",
];

export const ADMIN_STATUS_FLOW = [
  "New",
  "Screening",
  "Documents Outstanding",
  "Verification Pending",
  "PSiRA Verification Pending",
  "PSiRA Verified",
  "Ready for Consideration",
  "Shortlisted",
  "Interview",
  "Selected",
  "Hired",
  "Inactive",
  "Rejected",
];

export const PUBLIC_STATUS_LABEL: Record<string, string> = {
  New: "Application Received",
  Screening: "Under Screening",
  "Documents Outstanding": "Documents Outstanding",
  "Verification Pending": "Verification In Progress",
  "PSiRA Verification Pending": "PSiRA Verification In Progress",
  "PSiRA Verified": "PSiRA Verified",
  "Ready for Consideration": "Ready for Consideration",
  Shortlisted: "Shortlisted",
  Interview: "Interview Stage",
  Selected: "Selected",
  Hired: "Hired",
  Inactive: "Application Inactive",
  Rejected: "Not Selected at This Time",
};

export const STATUS_COLORS: Record<string, string> = {
  New: "#7DA3C4",
  Screening: "#C9A227",
  "Documents Outstanding": "#C4703D",
  "Verification Pending": "#C9A227",
  "PSiRA Verification Pending": "#C9A227",
  "PSiRA Verified": "#4C9A6A",
  "Ready for Consideration": "#4C9A6A",
  Shortlisted: "#3FA6A6",
  Interview: "#3FA6A6",
  Selected: "#4C9A6A",
  Hired: "#4C9A6A",
  Inactive: "#7A7A7A",
  Rejected: "#B5453F",
};

export const DOC_STATUS_COLORS: Record<string, string> = {
  Missing: "#707070",
  Uploaded: "#7DA3C4",
  "Under Review": "#C9A227",
  Verified: "#4C9A6A",
  Rejected: "#B5453F",
  Expired: "#B5453F",
};
