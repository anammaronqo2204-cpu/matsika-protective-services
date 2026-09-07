import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  adminUsers,
  auditLog,
  candidateDocuments,
  candidates,
  leads,
  statusHistory,
  internalNotes,
  vacancies,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { DOC_TYPES } from "@/lib/constants";
import { refNumber, leadRef, uid } from "@/lib/format";

const DEMO_ADMINS = [
  {
    username: "admin",
    password: "MatsikaAdmin#2026",
    name: "T. Matsika",
    role: "Super Administrator",
  },
  {
    username: "recruiter",
    password: "Recruiter#2026",
    name: "L. Ndlovu",
    role: "Recruitment Administrator",
  },
  {
    username: "docs",
    password: "DocsReview#2026",
    name: "S. Khumalo",
    role: "Document Verification Officer",
  },
  { username: "viewer", password: "ReadOnly#2026", name: "Auditor", role: "Read Only" },
];

const DEMO_ROWS = [
  { fullName: "Sipho Dlamini", city: "Pretoria", province: "Gauteng", grade: "C", psiraStatus: "Verified", years: 6, avail: "Immediately", shift: "Night", emp: "Full-time", status: "Ready for Consideration" },
  { fullName: "Nomvula Khumalo", city: "Sandton", province: "Gauteng", grade: "B", psiraStatus: "Verified", years: 9, avail: "Within 2 weeks", shift: "Day", emp: "Full-time", status: "Shortlisted" },
  { fullName: "Johan van der Merwe", city: "Cape Town", province: "Western Cape", grade: "A", psiraStatus: "Verified", years: 14, avail: "Immediately", shift: "Both", emp: "Contract", status: "PSiRA Verified" },
  { fullName: "Thandeka Mokoena", city: "Durban", province: "KwaZulu-Natal", grade: "D", psiraStatus: "Verification pending", years: 2, avail: "Within 1 month", shift: "Day", emp: "Part-time", status: "Verification Pending" },
  { fullName: "Kagiso Molefe", city: "Polokwane", province: "Limpopo", grade: "E", psiraStatus: "Not yet verified", years: 1, avail: "Immediately", shift: "Night", emp: "Full-time", status: "Documents Outstanding" },
  { fullName: "Precious Nkosi", city: "Pretoria", province: "Gauteng", grade: "C", psiraStatus: "Verified", years: 5, avail: "Immediately", shift: "Night", emp: "Full-time", status: "Shortlisted" },
  { fullName: "Willem Botha", city: "Gqeberha", province: "Eastern Cape", grade: "B", psiraStatus: "Expired", years: 11, avail: "Not currently available", shift: "Day", emp: "Full-time", status: "Inactive" },
  { fullName: "Ayanda Zulu", city: "Bloemfontein", province: "Free State", grade: "C", psiraStatus: "Candidate claims active", years: 4, avail: "Within 2 weeks", shift: "Both", emp: "Contract", status: "Screening" },
  { fullName: "Refilwe Sithole", city: "Sandton", province: "Gauteng", grade: "D", psiraStatus: "Verified", years: 3, avail: "Immediately", shift: "Night", emp: "Full-time", status: "Interview" },
  { fullName: "Mandla Cele", city: "Rustenburg", province: "North West", grade: "A", psiraStatus: "Verified", years: 16, avail: "Within 1 month", shift: "Day", emp: "Full-time", status: "Hired" },
  { fullName: "Lerato Mahlangu", city: "Mbombela", province: "Mpumalanga", grade: "E", psiraStatus: "Not yet verified", years: 0, avail: "Immediately", shift: "Both", emp: "Part-time", status: "New" },
  { fullName: "Frans Kruger", city: "Kimberley", province: "Northern Cape", grade: "B", psiraStatus: "Verified", years: 8, avail: "Immediately", shift: "Night", emp: "Full-time", status: "PSiRA Verification Pending" },
];

const DEMO_VACANCIES = [
  {
    code: "VAC-001",
    title: "Grade C Security Officer — Corporate Park",
    location: "Menlyn, Pretoria",
    province: "Gauteng",
    grade: "C",
    shift: "Night",
    employmentType: "Full-time",
    summary:
      "Static post at a AAA-grade corporate park. Access control, visitor screening and hourly patrol tours with digital occurrence reporting.",
    requirements: [
      "Valid PSiRA Grade C registration",
      "Minimum 2 years corporate site experience",
      "Clear criminal record and credit check",
      "Own reliable transport for night shift",
    ],
    positions: 6,
  },
  {
    code: "VAC-002",
    title: "Armed Response Officer",
    location: "Centurion",
    province: "Gauteng",
    grade: "B",
    shift: "Both",
    employmentType: "Full-time",
    summary:
      "Reaction vehicle crew responding to verified alarm activations, panic signals and control room dispatches across the Centurion footprint.",
    requirements: [
      "PSiRA Grade B or higher",
      "Valid SAPS firearm competency (handgun and shotgun)",
      "Valid Code 08 driver's licence",
      "Tactical response experience advantageous",
    ],
    positions: 4,
  },
  {
    code: "VAC-003",
    title: "CCTV Control Room Operator",
    location: "National Control Room, Pretoria",
    province: "Gauteng",
    grade: "C",
    shift: "Both",
    employmentType: "Full-time",
    summary:
      "Off-site monitoring of AI-assisted camera estates, verified alarm escalation and incident evidence packaging.",
    requirements: [
      "PSiRA Grade C registration",
      "CCTV operator certificate",
      "Strong written English for incident reports",
      "Ability to work 12-hour rotational shifts",
    ],
    positions: 3,
  },
  {
    code: "VAC-004",
    title: "Retail Loss Prevention Officer",
    location: "Gateway, Umhlanga",
    province: "KwaZulu-Natal",
    grade: "C",
    shift: "Day",
    employmentType: "Contract",
    summary:
      "Floor-walking and shrinkage control within a high-volume retail environment, working closely with store management.",
    requirements: [
      "PSiRA Grade C registration",
      "Retail or mall experience essential",
      "Strong observation and de-escalation skills",
      "Comfortable with statement writing",
    ],
    positions: 2,
  },
  {
    code: "VAC-005",
    title: "Site Supervisor — Industrial",
    location: "Rustenburg",
    province: "North West",
    grade: "A",
    shift: "Day",
    employmentType: "Full-time",
    summary:
      "Supervise a 24-officer industrial contract, manage rosters, conduct parades and interface directly with the client.",
    requirements: [
      "PSiRA Grade A registration",
      "5+ years supervisory experience",
      "Proven roster and payroll input experience",
      "Valid driver's licence",
    ],
    positions: 1,
  },
];

const DEMO_LEADS = [
  {
    name: "Karabo Mahlangu",
    company: "Sandton Ridge Body Corporate",
    email: "km@example-demo.co.za",
    phone: "011 555 0143",
    service: "Manned Guarding",
    sector: "Residential Estates",
    province: "Gauteng",
    siteAddress: "14 Ridge Road, Sandton",
    urgency: "Urgent",
    message: "Looking to replace our current provider at the end of the month. 3 posts, 24 hours.",
    status: "Contacted",
  },
  {
    name: "Dr. E. Naidoo",
    company: "Umhlanga Medical Suites",
    email: "enaidoo@example-demo.co.za",
    phone: "031 555 0192",
    service: "CCTV & Remote Monitoring",
    sector: "Education & Healthcare",
    province: "KwaZulu-Natal",
    siteAddress: "Umhlanga Rocks Drive",
    urgency: "Standard",
    message: "Require after-hours camera monitoring for a 22-camera estate.",
    status: "Quoted",
  },
  {
    name: "P. van Wyk",
    company: "Cape Freight Logistics",
    email: "pvw@example-demo.co.za",
    phone: "021 555 0110",
    service: "Specialised Operations",
    sector: "Industrial & Logistics",
    province: "Western Cape",
    siteAddress: "Airport Industria",
    urgency: "Emergency",
    message: "Need load escort capability for high-value electronics moving nightly.",
    status: "New",
  },
];

let seedPromise: Promise<void> | null = null;

async function runSeed(): Promise<void> {
  // Admin users
  const existingAdmins = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
  if (existingAdmins.length === 0) {
    await db.insert(adminUsers).values(
      DEMO_ADMINS.map((a) => ({
        username: a.username,
        passwordHash: hashPassword(a.password),
        name: a.name,
        role: a.role,
      })),
    );
  }

  // Vacancies
  const existingVacancies = await db.select({ id: vacancies.id }).from(vacancies).limit(1);
  if (existingVacancies.length === 0) {
    await db.insert(vacancies).values(DEMO_VACANCIES);
  }

  // Leads
  const existingLeads = await db.select({ id: leads.id }).from(leads).limit(1);
  if (existingLeads.length === 0) {
    for (let i = 0; i < DEMO_LEADS.length; i++) {
      const row = DEMO_LEADS[i];
      const created = new Date();
      created.setDate(created.getDate() - (i * 2 + 1));
      const [inserted] = await db
        .insert(leads)
        .values({ ...row, createdAt: created })
        .returning({ id: leads.id });
      await db
        .update(leads)
        .set({ reference: leadRef(inserted.id) })
        .where(sql`${leads.id} = ${inserted.id}`);
    }
  }

  // Candidates
  const existingCandidates = await db.select({ id: candidates.id }).from(candidates).limit(1);
  if (existingCandidates.length === 0) {
    const docStatuses = ["Verified", "Uploaded", "Under Review", "Missing"];
    for (let i = 0; i < DEMO_ROWS.length; i++) {
      const r = DEMO_ROWS[i];
      const created = new Date();
      created.setDate(created.getDate() - (i * 3 + 1));
      const [first, ...rest] = r.fullName.split(" ");
      const [inserted] = await db
        .insert(candidates)
        .values({
          fullName: r.fullName,
          idNumber: "DEMO-" + String(8000000000000 + i * 137),
          dob: `199${i % 10}-0${(i % 9) + 1}-1${i % 2}`,
          gender: i % 3 === 0 ? "Female" : "Male",
          mobile: `082 ${100 + i} ${4000 + i * 7}`,
          email:
            (first + "." + (rest.join("") || "candidate")).toLowerCase() +
            "@example-demo.co.za",
          address: "Demo Street " + (i + 1),
          city: r.city,
          province: r.province,
          preferredAreas: r.city + " and surrounds",
          psiraNumber: "PSR" + (100000 + i * 91),
          psiraGrade: r.grade,
          psiraStatus: r.psiraStatus,
          yearsExperience: r.years,
          previousEmployer: "Demo Security Co. " + (i + 1),
          previousSites: "Retail site, Corporate park",
          referenceDetails: `Supervisor Demo, 083 000 000${i % 10}`,
          qualifications: [
            {
              id: uid(),
              type: "Security Grade " + r.grade,
              provider: "Demo Training Academy",
              completionDate: `2022-03-1${i % 9}`,
            },
          ],
          firstAid: i % 2 === 0,
          firefighting: i % 3 === 0,
          otherTraining: "",
          availability: r.avail,
          shift: r.shift,
          employmentType: r.emp,
          preferredLocations: r.city,
          consentAgreed: true,
          consentAt: created,
          notifyEnabled: i % 2 === 0,
          notifyGrade: r.grade,
          notifyLocation: r.city,
          notifyShift: r.shift,
          notifyEmploymentType: r.emp,
          status: r.status,
          isDemo: true,
          createdAt: created,
          updatedAt: created,
        })
        .returning({ id: candidates.id, seq: candidates.seq });

      await db
        .update(candidates)
        .set({ refNumber: refNumber(inserted.seq) })
        .where(sql`${candidates.id} = ${inserted.id}`);

      await db.insert(candidateDocuments).values(
        DOC_TYPES.map((t, di) => {
          const status =
            r.status === "New" ? "Missing" : docStatuses[(i + di) % docStatuses.length];
          return {
            candidateId: inserted.id,
            docKey: t.key,
            status,
            filename: status === "Missing" ? null : `${t.key}_demo.pdf`,
            mimeType: status === "Missing" ? null : "application/pdf",
            sizeBytes: status === "Missing" ? 0 : 184320,
            dataBase64: null,
            uploadedAt: status === "Missing" ? null : created,
          };
        }),
      );

      await db.insert(statusHistory).values([
        { candidateId: inserted.id, status: "New", changedBy: "System", createdAt: created },
        ...(r.status !== "New"
          ? [
              {
                candidateId: inserted.id,
                status: r.status,
                changedBy: "Demo Seed",
                createdAt: created,
              },
            ]
          : []),
      ]);

      if (i === 1) {
        await db.insert(internalNotes).values({
          candidateId: inserted.id,
          body: "Strong references from previous employer — follow up on availability for the Menlyn night contract.",
          author: "L. Ndlovu",
          createdAt: created,
        });
      }
    }

    await db.insert(auditLog).values({
      actor: "System",
      action: "Demo data seeded",
      detail: `${DEMO_ROWS.length} demo candidates, ${DEMO_VACANCIES.length} vacancies`,
    });
  }
}

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}
