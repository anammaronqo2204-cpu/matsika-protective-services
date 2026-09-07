export const COMPANY = {
  name: "Matsika Protective Services",
  short: "Matsika",
  legal: "Matsika Legacy Holdings (Pty) Ltd",
  tagline: "Protecting Today. Securing Tomorrow.",
  phone: "+27 12 004 8800",
  emergency: "086 111 6242",
  email: "info@matsikaprotective.co.za",
  careersEmail: "careers@matsikaprotective.co.za",
  address: "Building 4, Menlyn Corporate Park, Pretoria, Gauteng",
  psira: "PSiRA Reg. No. 4820115",
  hours: "24 Hours / 365 Days — National Control Room",
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
  { key: "idDocument", label: "ID Document", required: true },
  { key: "cv", label: "Curriculum Vitae", required: true },
  { key: "psiraProof", label: "PSiRA Certificate / Proof", required: false },
  { key: "trainingCert", label: "Security Training Certificate", required: false },
  { key: "firstAidCert", label: "First Aid Certificate", required: false },
  { key: "firefightingCert", label: "Firefighting Certificate", required: false },
  { key: "proofOfAddress", label: "Proof of Address", required: false },
  { key: "other", label: "Other Supporting Document", required: false },
] as const;

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

export const LEAD_STATUSES = ["New", "Contacted", "Site Survey", "Quoted", "Won", "Lost"];

export const LEAD_STATUS_COLORS: Record<string, string> = {
  New: "#7DA3C4",
  Contacted: "#C9A227",
  "Site Survey": "#3FA6A6",
  Quoted: "#E9C85A",
  Won: "#4C9A6A",
  Lost: "#B5453F",
};

export const ROLES = {
  SUPER: "Super Administrator",
  RECRUITER: "Recruitment Administrator",
  DOCS: "Document Verification Officer",
  VIEWER: "Read Only",
} as const;

export const ROLE_CAN_EDIT_STATUS: Record<string, boolean> = {
  [ROLES.SUPER]: true,
  [ROLES.RECRUITER]: true,
  [ROLES.DOCS]: false,
  [ROLES.VIEWER]: false,
};

export const ROLE_CAN_EDIT_DOCS: Record<string, boolean> = {
  [ROLES.SUPER]: true,
  [ROLES.RECRUITER]: true,
  [ROLES.DOCS]: true,
  [ROLES.VIEWER]: false,
};

export const ROLE_CAN_ADD_NOTES: Record<string, boolean> = {
  [ROLES.SUPER]: true,
  [ROLES.RECRUITER]: true,
  [ROLES.DOCS]: true,
  [ROLES.VIEWER]: false,
};

export const SERVICES = [
  {
    slug: "manned-guarding",
    icon: "shield",
    title: "Manned Guarding",
    short: "PSiRA-graded officers deployed to residential, commercial and industrial sites.",
    body: "Vetted, uniformed and continuously supervised security officers backed by biometric parade systems, live shift reporting and unannounced night inspections by area managers.",
    points: [
      "Grade A–C officers matched to site risk",
      "Digital occurrence books and shift handovers",
      "GPS-verified guard monitoring and patrol tours",
      "Relief pool guaranteeing zero unmanned posts",
    ],
  },
  {
    slug: "armed-response",
    icon: "siren",
    title: "Armed Response",
    short: "Rapid tactical reaction vehicles on standby around the clock.",
    body: "Marked and unmarked reaction vehicles crewed by firearm-competent officers, dispatched from our 24/7 control room with average urban response times under 7 minutes.",
    points: [
      "Under 7 minute average urban response",
      "Panic button, app and radio activation",
      "Armed escort and safe-arrival services",
      "SAPS and medical liaison on scene",
    ],
  },
  {
    slug: "cctv-remote-monitoring",
    icon: "cctv",
    title: "CCTV & Remote Monitoring",
    short: "AI-assisted off-site surveillance from our national control room.",
    body: "Analytics-driven camera monitoring with intrusion detection, licence plate recognition and voice-down deterrence, all evidenced with time-stamped incident footage.",
    points: [
      "AI motion and perimeter analytics",
      "Live voice-down deterrence",
      "Licence plate recognition and blacklists",
      "Verified alarm escalation to response teams",
    ],
  },
  {
    slug: "access-control",
    icon: "scan",
    title: "Access Control",
    short: "Biometric, boom and visitor management systems that lock down your perimeter.",
    body: "Design, installation and manning of access control infrastructure — from biometric turnstiles at head offices to contractor screening at industrial gate houses.",
    points: [
      "Biometric and card-based enrolment",
      "Visitor, contractor and vehicle screening",
      "Boom, turnstile and gatehouse manning",
      "Full audit trail and reporting",
    ],
  },
  {
    slug: "vip-protection",
    icon: "user-check",
    title: "VIP & Close Protection",
    short: "Discreet executive protection for principals, families and delegations.",
    body: "Grade A close protection officers with advance route planning, secure transport, residential hardening and confidential threat assessment.",
    points: [
      "Advance route and venue reconnaissance",
      "Secure chauffeur and convoy operations",
      "Residential and travel risk hardening",
      "Absolute discretion and NDA cover",
    ],
  },
  {
    slug: "event-security",
    icon: "users",
    title: "Event & Crowd Safety",
    short: "Accredited crowd management for stadiums, festivals and conferences.",
    body: "SASREA-aligned event planning, accreditation control, crowd flow management and integrated medical and fire liaison for events of any scale.",
    points: [
      "SASREA-aligned safety planning",
      "Accreditation and search points",
      "Crowd flow and evacuation planning",
      "Command centre and radio network",
    ],
  },
  {
    slug: "risk-assessment",
    icon: "clipboard",
    title: "Risk & Threat Assessment",
    short: "Independent site surveys that quantify your exposure before you spend.",
    body: "Our risk consultants map physical, procedural and human vulnerabilities into a costed mitigation plan aligned to your insurer's requirements.",
    points: [
      "Free initial site survey",
      "Costed mitigation roadmap",
      "Insurance and compliance alignment",
      "Post-incident forensic review",
    ],
  },
  {
    slug: "specialised-services",
    icon: "truck",
    title: "Specialised Operations",
    short: "Asset escorts, retail loss prevention and mine security support.",
    body: "Purpose-built teams for high-value asset movement, retail shrinkage control, farm and agricultural protection and industrial strike contingency.",
    points: [
      "High-value asset and load escorts",
      "Retail loss prevention officers",
      "Agricultural and rural protection",
      "Labour unrest contingency planning",
    ],
  },
];

export const SECTORS = [
  { title: "Residential Estates", body: "Access control, patrols and estate rule enforcement." },
  { title: "Commercial & Corporate", body: "Reception-facing officers and building-wide control." },
  { title: "Retail & Malls", body: "Shrinkage control, crowd flow and after-hours lock-up." },
  { title: "Industrial & Logistics", body: "Gatehouse screening, load verification and yard patrols." },
  { title: "Mining & Energy", body: "Perimeter integrity, copper theft and contractor control." },
  { title: "Education & Healthcare", body: "Campus safety, visitor vetting and 24/7 posts." },
  { title: "Agriculture & Rural", body: "Farm watch integration and rapid rural response." },
  { title: "Events & Hospitality", body: "Crowd safety, VIP handling and venue lock-down." },
];

export const STATS = [
  { value: "1 200+", label: "Officers in the talent pool" },
  { value: "340+", label: "Sites under protection" },
  { value: "< 7 min", label: "Average armed response" },
  { value: "24/7/365", label: "National control room" },
];

export const ACCREDITATIONS = [
  "PSiRA Registered",
  "SASA Member Standard",
  "POPIA Compliant",
  "SAPS Firearm Competency",
  "SASSETA Accredited Training",
  "B-BBEE Level 1 Contributor",
];

export const PROCESS_STEPS = [
  {
    title: "Risk Survey",
    body: "A consultant walks your site, maps vulnerabilities and photographs every exposure point.",
  },
  {
    title: "Costed Proposal",
    body: "You receive a written security plan with officer grades, technology and transparent pricing.",
  },
  {
    title: "Mobilisation",
    body: "Vetted officers are matched, site-inducted and posted with SOPs signed off by you.",
  },
  {
    title: "Assured Performance",
    body: "Live dashboards, monthly service reviews and unannounced audits keep standards locked in.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Matsika took over a 24-hour industrial contract with three days' notice and did not miss a single shift. Their occurrence reporting is the best we have seen in fifteen years.",
    name: "Operations Director",
    org: "National Logistics Group",
  },
  {
    quote:
      "Break-ins on the estate dropped to zero in the first quarter after their access control and patrol regime went live. Residents notice the difference.",
    name: "Chairperson",
    org: "Waterkloof Ridge Estate HOA",
  },
  {
    quote:
      "The control room escalated a verified intrusion and had a reaction vehicle on site before our own alarm company called us back.",
    name: "Financial Manager",
    org: "Retail Group, Gauteng",
  },
];

export const FAQS = [
  {
    q: "Are your officers PSiRA registered?",
    a: "Every officer deployed by Matsika Protective Services is registered with the Private Security Industry Regulatory Authority. We independently verify PSiRA status and grading before deployment and re-verify at renewal.",
  },
  {
    q: "How fast can you mobilise a new site?",
    a: "A standard commercial or residential site can be surveyed, quoted and mobilised within 72 hours. Emergency takeovers have been executed in under 24 hours where infrastructure already exists.",
  },
  {
    q: "Do you provide both guarding and technology?",
    a: "Yes. We integrate manned guarding with CCTV, access control, alarms and off-site monitoring so one accountable provider owns the outcome instead of pointing fingers between suppliers.",
  },
  {
    q: "How do you handle personal information?",
    a: "All candidate and client data is processed in line with POPIA. Access is restricted to authorised personnel, records are retained only as long as legally required and data subjects may request access, correction or deletion at any time.",
  },
  {
    q: "Is registering on your careers portal the same as PSiRA registration?",
    a: "No. Our careers portal places you in the Matsika officer talent pool. It does not register you with PSiRA and does not guarantee employment or deployment. PSiRA status is verified independently through official processes.",
  },
];
