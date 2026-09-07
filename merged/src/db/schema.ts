import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------- Admin users ------------------------------ */

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------- Candidates ------------------------------ */

export type Qualification = {
  id: string;
  type: string;
  provider: string;
  completionDate: string;
};

export const candidates = pgTable("candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  seq: serial("seq").notNull(),
  refNumber: text("ref_number").notNull().default(""),

  // Personal
  fullName: text("full_name").notNull(),
  idNumber: text("id_number").notNull(),
  dob: text("dob").default(""),
  gender: text("gender").default(""),
  mobile: text("mobile").notNull().default(""),
  email: text("email").notNull().default(""),
  address: text("address").default(""),
  city: text("city").default(""),
  province: text("province").default(""),
  preferredAreas: text("preferred_areas").default(""),

  // Security profile
  psiraNumber: text("psira_number").default(""),
  psiraGrade: text("psira_grade").default("Not yet registered"),
  psiraStatus: text("psira_status").default("Not yet verified"),
  yearsExperience: integer("years_experience").default(0),
  previousEmployer: text("previous_employer").default(""),
  previousSites: text("previous_sites").default(""),
  referenceDetails: text("reference_details").default(""),

  // Training
  qualifications: jsonb("qualifications").$type<Qualification[]>().default([]).notNull(),
  firstAid: boolean("first_aid").default(false).notNull(),
  firefighting: boolean("firefighting").default(false).notNull(),
  otherTraining: text("other_training").default(""),

  // Availability
  availability: text("availability").default("Immediately"),
  shift: text("shift").default("Both"),
  employmentType: text("employment_type").default("Full-time"),
  preferredLocations: text("preferred_locations").default(""),
  appliedForVacancy: text("applied_for_vacancy").default(""),

  // Consent + alerts
  consentAgreed: boolean("consent_agreed").default(false).notNull(),
  consentAt: timestamp("consent_at", { withTimezone: true }),
  notifyEnabled: boolean("notify_enabled").default(false).notNull(),
  notifyGrade: text("notify_grade").default(""),
  notifyLocation: text("notify_location").default(""),
  notifyShift: text("notify_shift").default(""),
  notifyEmploymentType: text("notify_employment_type").default(""),

  // Workflow
  status: text("status").notNull().default("New"),
  isDemo: boolean("is_demo").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const candidateDocuments = pgTable("candidate_documents", {
  id: serial("id").primaryKey(),
  candidateId: uuid("candidate_id").notNull(),
  docKey: text("doc_key").notNull(),
  status: text("status").notNull().default("Missing"),
  filename: text("filename"),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes").default(0),
  dataBase64: text("data_base64"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export const statusHistory = pgTable("status_history", {
  id: serial("id").primaryKey(),
  candidateId: uuid("candidate_id").notNull(),
  status: text("status").notNull(),
  changedBy: text("changed_by").notNull().default("System"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const internalNotes = pgTable("internal_notes", {
  id: serial("id").primaryKey(),
  candidateId: uuid("candidate_id").notNull(),
  body: text("body").notNull(),
  author: text("author").notNull().default("Admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------- Audit log ------------------------------- */

export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  actor: text("actor").notNull().default("System"),
  action: text("action").notNull(),
  detail: text("detail").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------ Client leads ------------------------------ */

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().default(""),
  name: text("name").notNull(),
  company: text("company").default(""),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  service: text("service").default(""),
  sector: text("sector").default(""),
  province: text("province").default(""),
  siteAddress: text("site_address").default(""),
  urgency: text("urgency").default("Standard"),
  message: text("message").default(""),
  status: text("status").notNull().default("New"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* -------------------------------- Vacancies ------------------------------- */

export const vacancies = pgTable("vacancies", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().default(""),
  title: text("title").notNull(),
  location: text("location").notNull().default(""),
  province: text("province").notNull().default(""),
  grade: text("grade").notNull().default("C"),
  shift: text("shift").notNull().default("Both"),
  employmentType: text("employment_type").notNull().default("Full-time"),
  summary: text("summary").notNull().default(""),
  requirements: jsonb("requirements").$type<string[]>().default([]).notNull(),
  positions: integer("positions").default(1).notNull(),
  isOpen: boolean("is_open").default(true).notNull(),
  postedAt: timestamp("posted_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Candidate = typeof candidates.$inferSelect;
export type CandidateDocument = typeof candidateDocuments.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Vacancy = typeof vacancies.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
