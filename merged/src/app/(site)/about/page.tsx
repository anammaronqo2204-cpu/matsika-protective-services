import type { Metadata } from "next";
import { ArrowRight, Award, Building2, Compass, Handshake, Scale, Target } from "lucide-react";
import { BtnLink, Reveal, SectionLabel } from "@/components/ui";
import Backdrop from "@/components/site/Backdrop";
import { ACCREDITATIONS, COMPANY, STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Matsika Protective Services is a PSiRA-registered security services division of Matsika Legacy Holdings (Pty) Ltd, protecting people, property and reputations across South Africa.",
};

const VALUES = [
  {
    icon: Scale,
    title: "Integrity above contract",
    body: "If a post is not needed, we say so. Our proposals are built on measured risk, not padded headcount.",
  },
  {
    icon: Target,
    title: "Evidence, not assurances",
    body: "Every patrol, parade and inspection is time-stamped and auditable by the client at any hour.",
  },
  {
    icon: Handshake,
    title: "Officers treated properly",
    body: "Fair rostering, on-time pay and funded upgrading. Well-treated officers protect better.",
  },
  {
    icon: Compass,
    title: "Local knowledge, national reach",
    body: "Area managers who know the streets they patrol, supported by a national command structure.",
  },
];

const TIMELINE = [
  { year: "2016", title: "Founded", body: "Matsika Legacy Holdings established with a single guarding contract in Pretoria." },
  { year: "2019", title: "Control room commissioned", body: "24/7 monitoring centre opened, enabling verified alarm and camera response." },
  { year: "2022", title: "National footprint", body: "Operations extended into all nine provinces through regional supervision hubs." },
  { year: "2024", title: "Technology division", body: "AI camera analytics, LPR and integrated access control brought in-house." },
  { year: "2026", title: "Officer talent pool", body: "Digital recruitment and verification platform launched to professionalise hiring." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <Backdrop variant="crest" className="-z-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Reveal className="max-w-3xl">
            <SectionLabel>Who we are</SectionLabel>
            <h1 className="font-display text-white text-[40px] md:text-[58px] leading-[1.05]">
              A security company built on <span className="gold-text">discipline and proof.</span>
            </h1>
            <p className="text-zinc-300 text-[15px] leading-relaxed mt-6 max-w-2xl">
              {COMPANY.name} is the security services division and trading identity of{" "}
              {COMPANY.legal}. We deploy graded, verified officers backed by technology and
              supervision that clients can inspect for themselves.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid lg:grid-cols-3 gap-4">
        {[
          {
            icon: Building2,
            title: "Our mandate",
            body: "Protect people, assets and continuity of operations for clients who cannot afford a security failure — and prove that protection with data.",
          },
          {
            icon: Award,
            title: "Our standard",
            body: "Every officer independently PSiRA-verified, criminally screened, site-inducted and supervised by a named area manager.",
          },
          {
            icon: Target,
            title: "Our promise",
            body: "No unmanned posts, no ghost patrols, no unanswered escalations. Failures are reported by us before you notice them.",
          },
        ].map((c, i) => (
          <Reveal key={c.title} delay={i * 80}>
            <div className="h-full rounded-2xl border border-line bg-panel p-7">
              <c.icon size={20} className="text-gold" />
              <h2 className="text-white font-semibold text-[16px] mt-5">{c.title}</h2>
              <p className="text-mute text-[13px] leading-relaxed mt-3">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="border-y border-line bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-2 lg:grid-cols-4 divide-x divide-line">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 60} className="px-4 py-4 text-center">
              <div className="font-display text-[32px] md:text-[40px] leading-none gold-text">
                {s.value}
              </div>
              <div className="text-[10.5px] tracking-[0.16em] uppercase text-mute mt-2">
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-14">
        <Reveal>
          <SectionLabel>Our values</SectionLabel>
          <h2 className="font-display text-white text-[32px] md:text-[42px] leading-[1.1]">
            What we refuse to compromise on.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-line bg-panel p-5">
                <v.icon size={17} className="text-gold" />
                <p className="text-white font-semibold text-[13.5px] mt-4">{v.title}</p>
                <p className="text-mute text-[12.5px] leading-relaxed mt-2">{v.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <SectionLabel>Our journey</SectionLabel>
          <h2 className="font-display text-white text-[32px] md:text-[42px] leading-[1.1]">
            Ten years of steady, deliberate growth.
          </h2>
          <ol className="mt-8 relative border-l border-line pl-6 space-y-7">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-gold ring-4 ring-black" />
                <p className="font-display text-gold text-[20px] leading-none">{t.year}</p>
                <p className="text-white font-semibold text-[14px] mt-2">{t.title}</p>
                <p className="text-mute text-[12.5px] leading-relaxed mt-1.5">{t.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="border-y border-line bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Reveal className="text-center">
            <SectionLabel>
              <span className="block text-center">Compliance</span>
            </SectionLabel>
            <h2 className="font-display text-white text-[30px] md:text-[40px] leading-[1.1]">
              Registered, accredited and audited.
            </h2>
            <p className="text-mist text-[13.5px] mt-4 max-w-2xl mx-auto leading-relaxed">
              {COMPANY.psira}. Officer registrations are verified independently through official
              PSiRA processes, and all personal information is processed in line with POPIA.
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3 mt-9">
            {ACCREDITATIONS.map((a, i) => (
              <Reveal key={a} delay={i * 40}>
                <span className="inline-block rounded-full border border-line bg-panel px-5 py-2.5 text-[11.5px] tracking-[0.14em] uppercase text-gold-soft">
                  {a}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-white text-[32px] md:text-[44px] leading-[1.08]">
            Meet the team that will run your contract.
          </h2>
          <p className="text-mist text-[14.5px] mt-5 max-w-xl mx-auto leading-relaxed">
            You will know your service manager by name, and they will know your site by heart.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <BtnLink href="/contact" size="lg">
              Arrange an Introduction <ArrowRight size={16} />
            </BtnLink>
            <BtnLink href="/careers" variant="outline" size="lg">
              Work With Us
            </BtnLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
