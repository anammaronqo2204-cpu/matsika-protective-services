import { db } from "./index";
import { adminUsers, auditLogs, candidates } from "./schema";
import { hashPassword } from "../lib/auth";
import { DOC_TYPES } from "../lib/constants";
import { emptyDocs } from "../lib/serialize";

function uid() {
  return crypto.randomUUID();
}

/* Demo seed candidates — realistic South African security talent pool */
function buildSeedRows() {
  const rows = [
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

  return rows.map((r, i) => {
    const createdAt = new Date(Date.now() - (i * 3 + 1) * 24 * 3600 * 1000);
    const [first, ...rest] = r.fullName.split(" ");
    const docs = emptyDocs();
    const docStatuses = ["Verified", "Uploaded", "Under Review", "Missing"];
    DOC_TYPES.forEach((t, di) => {
      const st = r.status === "New" ? "Missing" : docStatuses[(i + di) % docStatuses.length];
      docs[t.key] = {
        status: st,
        filename: st === "Missing" ? null : `${t.key}_${i + 1}.pdf`,
        uploadedAt: st === "Missing" ? null : createdAt.toISOString(),
      };
    });
    return {
      refNumber: `MPS-${String(i + 1).padStart(6, "0")}`,
      createdAt,
      demo: true,
      fullName: r.fullName,
      idNumber: `DEMO-${8000000000000 + i * 137}`,
      dob: `1990-0${(i % 9) + 1}-1${i % 2}`,
      gender: i % 3 === 0 ? "Female" : "Male",
      mobile: `082 ${100 + i} ${4000 + i * 7}`,
      email: `${first}.${rest.join("") || "candidate"}`.toLowerCase() + "@example-demo.co.za",
      address: `${i + 1} Demo Street`,
      city: r.city,
      province: r.province,
      preferredAreas: `${r.city} and surrounds`,
      psiraNumber: r.grade === "Not yet registered" ? null : `PSR${100000 + i * 91}`,
      psiraGrade: r.grade,
      psiraStatus: r.psiraStatus,
      yearsExperience: r.years,
      previousEmployer: `Demo Security Co. ${i + 1}`,
      previousSites: "Retail site, Corporate park",
      referenceDetails: `Supervisor Demo, 083 000 000${i % 10}`,
      qualifications: [
        { id: uid(), type: `Security Grade ${r.grade}`, provider: "Demo Training Academy", completionDate: "2022-03-1" + (i % 9) },
      ],
      firstAid: i % 2 === 0,
      firefighting: i % 3 === 0,
      otherCertificates: null,
      availability: r.avail,
      shift: r.shift,
      employmentType: r.emp,
      preferredLocations: r.city,
      documents: docs,
      notifyEnabled: i % 4 === 0,
      notifyGrade: i % 4 === 0 ? r.grade : null,
      notifyLocation: i % 4 === 0 ? r.city : null,
      notifyShift: null,
      notifyEmploymentType: null,
      consentAgreed: true,
      consentTimestamp: createdAt,
      status: r.status,
      statusHistory: [
        { status: "New", timestamp: createdAt.toISOString(), by: "System" },
        { status: r.status, timestamp: createdAt.toISOString(), by: "Demo Seed" },
      ],
      internalNotes:
        i === 1
          ? [{ text: "Strong references from previous employer, follow up on availability.", timestamp: createdAt.toISOString(), by: "L. Ndlovu" }]
          : [],
    };
  });
}

export async function seed() {
  const existingAdmins = await db.select().from(adminUsers).limit(1);
  if (existingAdmins.length === 0) {
    const users = [
      { username: "admin", password: "MatsikaAdmin#2026", role: "Super Administrator", name: "T. Matsika" },
      { username: "recruiter", password: "Recruiter#2026", role: "Recruitment Administrator", name: "L. Ndlovu" },
      { username: "docs", password: "DocsReview#2026", role: "Document Verification Officer", name: "S. Khumalo" },
      { username: "viewer", password: "ReadOnly#2026", role: "Read Only", name: "Auditor" },
    ];
    for (const u of users) {
      await db.insert(adminUsers).values({
        username: u.username,
        passwordHash: hashPassword(u.password),
        role: u.role,
        name: u.name,
      });
    }
    console.log("Seeded admin users");
  }

  const existingCandidates = await db.select({ id: candidates.id }).from(candidates).limit(1);
  if (existingCandidates.length === 0) {
    const rows = buildSeedRows();
    for (const r of rows) {
      await db.insert(candidates).values(r);
    }
    await db.insert(auditLogs).values({
      actor: "System",
      action: "Demo data seeded",
      detail: `${rows.length} demo candidates loaded`,
    });
    console.log(`Seeded ${rows.length} demo candidates`);
  }

  const existingLogs = await db.select({ id: auditLogs.id }).from(auditLogs).limit(1);
  if (existingLogs.length === 0) {
    await db.insert(auditLogs).values({
      actor: "System",
      action: "Database initialised",
      detail: "Matsika Protective Services recruitment platform online",
    });
  }

  console.log("Seed complete");
}

if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  seed()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
