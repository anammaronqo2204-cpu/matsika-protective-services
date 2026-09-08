import {
  boolean,
  integer,
  jsonb,
  serial,
  text,
  timestamp,
  uuid,
  pgTable,
} from "drizzle-orm/pg-core";

export interface Qualification {
  id: string;
  type: string;
  provider: string;
  completionDate: string;
}

export interface DocEntry {
  status: string;
  filename: string | null;
  uploadedAt: string | null;
}

export interface HistoryEntry {
  status: string;
  timestamp: string;
  by: string;
}

export interface NoteEntry {
  text: string;
  timestamp: string;
  by: string;
}

export const candidates = pgTable("candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  seq: serial("seq").notNull(),
  refNumber: text("ref_number").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  demo: boolean("demo").notNull().default(false),

  /* personal */
  fullName: text("full_name").notNull(),
  idNumber: text("id_number").notNull(),
  dob: text("dob"),
  gender: text("gender"),
  mobile: text("mobile").notNull(),
  email: text("email").notNull(),
  address: text("address"),
  city: text("city"),
  province: text("province").notNull(),
  preferredAreas: text("preferred_areas"),

  /* security */
  psiraNumber: text("psira_number"),
  psiraGrade: text("psira_grade").notNull().default("Not yet registered"),
  psiraStatus: text("psira_status").notNull().default("Not yet verified"),
  yearsExperience: integer("years_experience").notNull().default(0),
  previousEmployer: text("previous_employer"),
  previousSites: text("previous_sites"),
  referenceDetails: text("reference_details"),

  /* training */
  qualifications: jsonb("qualifications")
    .$type<Qualification[]>()
    .notNull()
    .default([]),
  firstAid: boolean("first_aid").notNull().default(false),
  firefighting: boolean("firefighting").notNull().default(false),
  otherCertificates: text("other_certificates"),

  /* availability */
  availability: text("availability").notNull().default("Immediately"),
  shift: text("shift").notNull().default("Both"),
  employmentType: text("employment_type").notNull().default("Full-time"),
  preferredLocations: text("preferred_locations"),

  /* documents */
  documents: jsonb("documents").$type<Record<string, DocEntry>>().notNull().default({}),

  /* notifications */
  notifyEnabled: boolean("notify_enabled").notNull().default(false),
  notifyGrade: text("notify_grade"),
  notifyLocation: text("notify_location"),
  notifyShift: text("notify_shift"),
  notifyEmploymentType: text("notify_employment_type"),

  /* consent */
  consentAgreed: boolean("consent_agreed").notNull().default(false),
  consentTimestamp: timestamp("consent_timestamp", { withTimezone: true }),

  /* workflow */
  status: text("status").notNull().default("New"),
  statusHistory: jsonb("status_history").$type<HistoryEntry[]>().notNull().default([]),
  internalNotes: jsonb("internal_notes").$type<NoteEntry[]>().notNull().default([]),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  service: text("service"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  handled: boolean("handled").notNull().default(false),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  ts: timestamp("ts", { withTimezone: true }).notNull().defaultNow(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  detail: text("detail").notNull().default(""),
});

export type CandidateRow = typeof candidates.$inferSelect;
export type ContactMessageRow = typeof contactMessages.$inferSelect;
export type AdminUserRow = typeof adminUsers.$inferSelect;
export type AuditLogRow = typeof auditLogs.$inferSelect;
