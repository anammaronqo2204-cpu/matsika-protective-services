import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Briefcase,
  Calendar,
  GraduationCap,
  Info,
  MapPin,
  Search,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { BtnLink, Reveal, SectionLabel } from "@/components/ui";
import Backdrop from "@/components/site/Backdrop";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers & Officer Talent Pool",
  description:
    "Register in the Matsika Protective Services security officer talent pool. View open security officer, armed response and control room vacancies across South Africa.",
};

const BENEFITS = [
  { icon: Banknote, title: "On-time, correct pay", body: "Payroll runs to the day, with transparent overtime and shift allowances." },
  { icon: GraduationCap, title: "Funded upgrading", body: "We fund grade upgrades and specialist courses for officers who commit." },
  { icon: Calendar, title: "Predictable rosters", body: "Published rosters and a real relief pool so leave actually gets taken." },
  { icon: ShieldCheck, title: "Proper equipment", body: "Issued uniform, PPE, radios and site-specific kit — replaced when worn." },
  { icon: Users, title: "Supervision that supports", body: "Area managers who visit posts, not just phone them." },
  { icon: BadgeCheck, title: "Career pathway", body: "Officer → senior officer → site supervisor → area manager, on merit." },
];

const HIRING_STEPS = [
  "Register your profile and upload documents",
  "Recruitment screening and reference checks",
  "Independent PSiRA verification",
  "Interview and site matching",
  "Induction, kit issue and deployment",
];

export default async function CareersPage() {
  let openRoles: Array<typeof vacancies.$inferSelect> = [];
  try {
    await ensureSeeded();
    openRoles = await db
      .select()
      .from(vacancies)
      .where(eq(vacancies.isOpen, true))
      .orderBy(desc(vacancies.postedAt));
  } catch (error) {
    console.error("careers vacancies failed", error);
  }

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <Backdrop variant="crest" className="-z-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <SectionLabel>Careers</SectionLabel>
            <h1 className="font-display text-white text-[40px] md:text-[58px] leading-[1.05]">
              Build a career, <span className="gold-text">not just a shift.</span>
            </h1>
            <p className="text-zinc-300 text-[15px] leading-relaxed mt-6">
              Register once in the Matsika officer talent pool. Our recruitment team verifies your
              grading and documents, then matches you to permanent, contract and relief posts as
              they open across all nine provinces.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-9">
              <BtnLink href="/careers/apply" size="lg">
                Register Your Profile <ArrowRight size={16} />
              </BtnLink>
              <BtnLink href="/careers/status" variant="outline" size="lg">
                <Search size={15} /> Track Application
              </BtnLink>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="bg-panel border-b border-line">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-start gap-2 text-[12px] text-gold-soft leading-relaxed">
          <Info size={13} className="text-gold shrink-0 mt-0.5" />
          Registration on this platform does not constitute registration with PSiRA and does not
          guarantee employment or deployment. PSiRA status is independently verified where required.
        </div>
      </div>

      {/* Open roles */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <SectionLabel>Open positions</SectionLabel>
            <h2 className="font-display text-white text-[32px] md:text-[42px] leading-[1.1]">
              {openRoles.length} live {openRoles.length === 1 ? "vacancy" : "vacancies"}
            </h2>
          </div>
          <p className="text-mute text-[12.5px] max-w-sm">
            No suitable role today? Register anyway — most placements come from the talent pool
            before a vacancy is ever advertised.
          </p>
        </Reveal>

        <div className="mt-10 space-y-3">
          {openRoles.length === 0 && (
            <div className="rounded-xl border border-line bg-panel p-8 text-center text-mute text-[13px]">
              No vacancies are advertised right now. Register your profile to be considered as soon
              as posts open.
            </div>
          )}
          {openRoles.map((v, i) => (
            <Reveal key={v.id} delay={(i % 4) * 60}>
              <article className="rounded-xl border border-line bg-panel p-6 md:p-7 hover:border-gold/45 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[10.5px] font-mono text-gold/70">{v.code}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/8 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-gold-soft">
                        Grade {v.grade}
                      </span>
                      <span className="text-[11px] text-mute">
                        Posted {fmtDate(v.postedAt.toISOString())}
                      </span>
                    </div>
                    <h3 className="font-display text-white text-[24px] mt-2.5">{v.title}</h3>
                    <p className="text-mist text-[13px] leading-relaxed mt-2.5 max-w-2xl">
                      {v.summary}
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[12px] text-mute">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} className="text-gold/70" /> {v.location}, {v.province}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Sun size={13} className="text-gold/70" /> {v.shift} shift
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase size={13} className="text-gold/70" /> {v.employmentType}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={13} className="text-gold/70" /> {v.positions} position
                        {v.positions === 1 ? "" : "s"}
                      </span>
                    </div>
                    {v.requirements.length > 0 && (
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-4">
                        {v.requirements.map((r) => (
                          <li key={r} className="flex gap-2 text-[12.5px] text-zinc-300">
                            <BadgeCheck size={13} className="text-gold shrink-0 mt-0.5" /> {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="shrink-0">
                    <Link
                      href={`/careers/apply?vacancy=${encodeURIComponent(v.code + " — " + v.title)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-[12.5px] font-bold uppercase tracking-[0.12em] bg-linear-to-b from-[#E9C85A] to-[#C9A227] text-black hover:from-[#F3DD93] hover:to-[#D6AE33]"
                    >
                      Apply <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-line bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal className="max-w-2xl">
            <SectionLabel>Why officers stay</SectionLabel>
            <h2 className="font-display text-white text-[32px] md:text-[42px] leading-[1.1]">
              We look after the people who look after our clients.
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={(i % 3) * 70}>
                <div className="h-full rounded-xl border border-line bg-panel p-6">
                  <b.icon size={18} className="text-gold" />
                  <p className="text-white font-semibold text-[14px] mt-4">{b.title}</p>
                  <p className="text-mute text-[12.5px] leading-relaxed mt-2">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring process */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="max-w-2xl">
          <SectionLabel>Our hiring process</SectionLabel>
          <h2 className="font-display text-white text-[32px] md:text-[42px] leading-[1.1]">
            Transparent from application to deployment.
          </h2>
        </Reveal>
        <ol className="grid md:grid-cols-5 gap-3 mt-10">
          {HIRING_STEPS.map((s, i) => (
            <Reveal key={s} delay={i * 70}>
              <li className="h-full rounded-xl border border-line bg-panel p-5 list-none">
                <span className="inline-grid place-items-center w-8 h-8 rounded-lg bg-gold/12 border border-gold/30 text-gold font-bold text-[12.5px]">
                  {i + 1}
                </span>
                <p className="text-zinc-200 text-[13px] leading-relaxed mt-4">{s}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12">
          <div className="rounded-2xl border border-gold/25 bg-linear-to-r from-[#0E0C05] via-panel to-[#0E0C05] p-8 md:p-10 text-center">
            <h3 className="font-display text-white text-[28px] md:text-[36px]">
              Ready to be considered?
            </h3>
            <p className="text-mist text-[13.5px] mt-3 max-w-lg mx-auto leading-relaxed">
              The full registration takes about seven minutes. Have your ID, PSiRA certificate and
              CV ready to upload.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
              <BtnLink href="/careers/apply" size="lg">
                Start Registration <ArrowRight size={16} />
              </BtnLink>
              <BtnLink href="/careers/status" variant="outline" size="lg">
                Check My Status
              </BtnLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
