import Link from "next/link";
import { ArrowRight, Check, ClipboardCheck, Scale, ShieldCheck } from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import { Reveal } from "@/components/ui";
import { Spotlight } from "@/components/motion";

const pillars = [
  { icon: ShieldCheck, title: "Compliance", text: "PSiRA information and officer grading are checked as part of the recruitment and placement process." },
  { icon: ClipboardCheck, title: "Documentation", text: "Post duties, incidents and escalation procedures are documented to support accountable service delivery." },
  { icon: Scale, title: "Professional conduct", text: "Client confidentiality, lawful conduct and respect for employees, visitors and the public are expected on every assignment." },
];

const principles = [
  "A clear scope before deployment",
  "Personnel matched to site requirements",
  "Site-specific instructions and induction",
  "A defined escalation structure",
  "Accurate occurrence and incident reporting",
  "Management review of service delivery",
];

export default function AboutPage() {
  return (
    <div className="bg-ink text-cream">
      <SiteNav />
      <main>
        <section className="border-b border-line bg-black">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="rise rise-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Company profile</p>
              <h1 className="rise rise-2 mt-6 max-w-3xl text-[42px] font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-[56px]">
                Professional security requires professional management.
              </h1>
            </div>
            <p className="rise rise-3 border-l-2 border-gold pl-6 text-[14px] leading-7 text-mist">
              Matsika Protective Services is a security services division of Matsika Legacy Holdings (Pty) Ltd, serving organisations that require disciplined personnel and clear accountability.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Our approach</p>
            <h2 className="mt-5 text-[34px] font-semibold leading-tight tracking-[-0.025em] text-white">
              The contract must work at site level.
            </h2>
            <div className="mt-6 space-y-5 text-[14px] leading-7 text-dim">
              <p>
                Security is often purchased as a headcount. We treat it as an operating responsibility. Before recommending personnel or technology, we consider the site, operating hours, access requirements, known incidents and the client's internal procedures.
              </p>
              <p>
                The result is a defined service with clear post duties, reporting lines and escalation arrangements. This gives management a basis for measuring performance and gives officers a proper framework in which to work.
              </p>
              <p>
                Our recruitment platform supports this approach by maintaining structured information on officer grading, experience, training, availability and documentation.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="img-frame">
              <img src="/images/real/corporate-building.jpg" alt="Commercial property protected after hours" className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
        </section>

        <section className="border-y border-line bg-coal">
          <div className="mx-auto grid max-w-7xl border-l border-line md:grid-cols-3">
            {pillars.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <Spotlight className="lift group h-full border-b border-r border-line p-8 md:py-12">
                  <span className="inline-flex border border-line2 p-3 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    <item.icon size={21} strokeWidth={1.5} />
                  </span>
                  <h2 className="mt-7 text-[18px] font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-[13px] leading-6 text-dim">{item.text}</p>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Working principles</p>
              <h2 className="mt-5 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-white">What clients should expect from us.</h2>
            </Reveal>
            <div className="grid gap-x-12 gap-y-7 sm:grid-cols-2">
              {principles.map((item, i) => (
                <Reveal key={item} delay={i * 60}>
                  <div className="check-row flex items-start gap-3 border-b border-line pb-5 text-[14px] font-medium text-mist hover:border-gold/60">
                    <Check size={15} className="mt-0.5 shrink-0 text-gold" /> {item}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal>
            <div className="mt-20 flex flex-col items-start justify-between gap-7 border-t border-gold pt-8 md:flex-row md:items-center">
              <div>
                <h2 className="text-[24px] font-semibold text-white">Request a company introduction or site assessment.</h2>
                <p className="mt-2 text-[13px] text-dim">Speak directly with our team about your organisation and operating environment.</p>
              </div>
              <Link href="/contact" className="btn-arrow inline-flex shrink-0 items-center gap-2 bg-gold px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors duration-200 hover:bg-gold-pale">
                Contact Matsika <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
