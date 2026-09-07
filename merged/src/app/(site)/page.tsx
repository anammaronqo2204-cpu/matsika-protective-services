import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Gauge,
  Quote,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { BtnLink, Reveal, SectionLabel } from "@/components/ui";
import ServiceIcon from "@/components/site/ServiceIcon";
import Backdrop from "@/components/site/Backdrop";
import {
  ACCREDITATIONS,
  COMPANY,
  FAQS,
  PROCESS_STEPS,
  SECTORS,
  SERVICES,
  STATS,
  TESTIMONIALS,
} from "@/lib/constants";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SecurityService",
  name: COMPANY.name,
  legalName: COMPANY.legal,
  slogan: COMPANY.tagline,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  areaServed: "South Africa",
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address,
    addressCountry: "ZA",
  },
  openingHours: "Mo-Su 00:00-23:59",
  makesOffer: SERVICES.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.title, description: s.short },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {/* ------------------------------- HERO ------------------------------- */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Matsika security officer on duty at night"
          fill
          priority
          className="object-cover object-center -z-20"
        />
        <div className="absolute inset-0 hero-vignette -z-10" />
        <div className="absolute inset-0 grid-lines opacity-60 -z-10" />

        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-black/50 backdrop-blur px-3.5 py-1.5 text-[11px] tracking-[0.22em] uppercase text-gold-soft">
              <ShieldCheck size={13} className="text-gold" /> PSiRA Registered · National Coverage
            </div>
            <h1 className="font-display text-white text-[44px] leading-[1.03] sm:text-[62px] md:text-[76px] mt-6">
              Protecting Today.
              <br />
              <span className="gold-text">Securing Tomorrow.</span>
            </h1>
            <p className="text-zinc-300 text-[15px] md:text-[17px] leading-relaxed mt-6 max-w-xl">
              Graded security officers, armed response and AI-assisted off-site monitoring — engineered
              into one accountable protection plan for your people, property and reputation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-9">
              <BtnLink href="/contact" size="lg">
                Request a Free Site Survey <ArrowRight size={16} />
              </BtnLink>
              <BtnLink href="/careers/apply" variant="outline" size="lg">
                Join Our Officer Network
              </BtnLink>
            </div>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mt-10">
              {[
                { icon: Clock, text: "Under 7 min average response" },
                { icon: Radio, text: "24/7/365 control room" },
                { icon: BadgeCheck, text: "Independently PSiRA verified officers" },
              ].map((item) => (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-2 text-[12.5px] text-zinc-300"
                >
                  <item.icon size={14} className="text-gold" /> {item.text}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Stats bar */}
        <div className="relative border-y border-line bg-black/75 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-line">
            {STATS.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 70}
                className="px-4 py-7 text-center lg:text-left first:pl-0 last:pr-0"
              >
                <div className="font-display text-[30px] md:text-[38px] leading-none gold-text">
                  {s.value}
                </div>
                <div className="text-[11px] tracking-[0.16em] uppercase text-mute mt-2">
                  {s.label}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------- ACCREDITATIONS -------------------------- */}
      <section className="overflow-hidden border-b border-line-soft bg-[#050505] py-4">
        <div className="flex w-max marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center">
              {ACCREDITATIONS.map((a) => (
                <span
                  key={`${dup}-${a}`}
                  className="mx-7 inline-flex items-center gap-2 text-[11px] tracking-[0.26em] uppercase text-mute"
                >
                  <Sparkles size={11} className="text-gold/70" /> {a}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ SERVICES ----------------------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <SectionLabel>What we do</SectionLabel>
          <h2 className="font-display text-white text-[34px] md:text-[46px] leading-[1.08]">
            A complete security capability, delivered by one accountable partner.
          </h2>
          <p className="text-mist text-[14.5px] leading-relaxed mt-5">
            Most sites fail not because of a missing camera, but because guarding, technology and
            response are owned by three different suppliers. Matsika designs, mans and monitors the
            entire layered defence — so accountability never falls between the cracks.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 70}>
              <Link
                href={`/services#${s.slug}`}
                className="group block h-full rounded-xl border border-line bg-panel p-6 transition-all duration-300 hover:border-gold/50 hover:bg-panel-2 hover:-translate-y-1"
              >
                <span className="inline-grid place-items-center w-11 h-11 rounded-lg border border-gold/25 bg-gold/8 text-gold transition-colors group-hover:bg-gold group-hover:text-black">
                  <ServiceIcon name={s.icon} size={19} />
                </span>
                <h3 className="text-white font-semibold text-[15.5px] mt-5">{s.title}</h3>
                <p className="text-mute text-[12.5px] leading-relaxed mt-2.5">{s.short}</p>
                <span className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-[0.14em] text-gold/80 mt-5 group-hover:text-gold">
                  Explore <ChevronRight size={12} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------- WHY US ------------------------------ */}
      <section className="border-y border-line bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal className="relative">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-line">
              <Image
                src="/images/guarding.jpg"
                alt="Access control officer at an estate entrance"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-2 md:right-6 bg-[#0B0B0D] border border-gold/30 rounded-xl px-6 py-5 shadow-2xl shadow-black">
              <div className="font-display text-[34px] leading-none gold-text">98.6%</div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-mute mt-1.5">
                Post-fill rate, last 12 months
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <SectionLabel>Why Matsika</SectionLabel>
            <h2 className="font-display text-white text-[32px] md:text-[44px] leading-[1.1]">
              Discipline you can audit, not just promise.
            </h2>
            <p className="text-mist text-[14.5px] leading-relaxed mt-5">
              Every officer is vetted, graded and verified before they set foot on your site — and
              every shift is evidenced in a digital occurrence book you can read at any hour.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                {
                  title: "Independent PSiRA verification",
                  body: "Grading and registration confirmed through official PSiRA processes before deployment and again at renewal.",
                },
                {
                  title: "Supervision that shows up unannounced",
                  body: "Area managers conduct random night inspections; every visit is logged with time, GPS and photographic proof.",
                },
                {
                  title: "Live client visibility",
                  body: "Incident reports, patrol tours and parade registers pushed to you in near real time — no month-end surprises.",
                },
                {
                  title: "Relief pool, not empty posts",
                  body: "A standing pool of graded relief officers keeps contracted posts filled through leave, illness and turnover.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3.5">
                  <CheckCircle2 size={18} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold text-[14px]">{item.title}</p>
                    <p className="text-mute text-[12.5px] leading-relaxed mt-1">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <BtnLink href="/about" variant="outline">
                More about our standards <ArrowRight size={14} />
              </BtnLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------- CONTROL ROOM -------------------------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal className="order-2 lg:order-1">
            <SectionLabel>Technology</SectionLabel>
            <h2 className="font-display text-white text-[32px] md:text-[44px] leading-[1.1]">
              A control room that watches when nobody else is.
            </h2>
            <p className="text-mist text-[14.5px] leading-relaxed mt-5">
              Cameras only pay for themselves when someone acts on them. Our operators run
              AI-assisted analytics across client camera estates, verify the threat, talk down the
              intruder and dispatch armed response — usually before an alarm panel has finished
              dialling.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-8">
              {[
                { icon: Eye, title: "Verified detection", body: "Analytics filter false alarms so response is dispatched to real events." },
                { icon: Radio, title: "Voice-down deterrence", body: "Live audio challenge on intrusion, logged with the incident file." },
                { icon: Gauge, title: "Measured response", body: "Every dispatch time-stamped from detection to officer on scene." },
                { icon: Users, title: "Human escalation", body: "Named controllers escalate to you, SAPS and medical services." },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border border-line bg-panel p-4">
                  <f.icon size={16} className="text-gold" />
                  <p className="text-white font-semibold text-[13.5px] mt-3">{f.title}</p>
                  <p className="text-mute text-[12px] leading-relaxed mt-1.5">{f.body}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100} className="order-1 lg:order-2">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-line">
              <Image
                src="/images/control-room.jpg"
                alt="Matsika 24/7 national control room"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/70 backdrop-blur border border-gold/30 px-3.5 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4C9A6A] animate-pulse" />
                <span className="text-[11px] tracking-[0.18em] uppercase text-gold-soft">
                  Control room live
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------- SECTORS ----------------------------- */}
      <section className="border-y border-line bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <SectionLabel>Sectors</SectionLabel>
              <h2 className="font-display text-white text-[32px] md:text-[44px] leading-[1.1]">
                Risk looks different in every industry.
              </h2>
            </div>
            <BtnLink href="/sectors" variant="ghost">
              See all sectors <ArrowRight size={14} />
            </BtnLink>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
            {SECTORS.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 60}>
                <div className="group h-full rounded-xl border border-line bg-panel px-5 py-6 transition-colors hover:border-gold/45">
                  <div className="text-[11px] font-mono text-gold/60">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-white font-semibold text-[14.5px] mt-2.5">{s.title}</h3>
                  <p className="text-mute text-[12.5px] leading-relaxed mt-2">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- PROCESS ----------------------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <SectionLabel>How we mobilise</SectionLabel>
          <h2 className="font-display text-white text-[32px] md:text-[44px] leading-[1.1]">
            From first call to fully manned in 72 hours.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <div className="relative h-full rounded-xl border border-line bg-panel p-6 overflow-hidden">
                <span className="absolute -top-4 right-3 font-display text-[76px] leading-none text-white/4 select-none">
                  {i + 1}
                </span>
                <div className="w-9 h-9 rounded-lg bg-gold/12 border border-gold/30 grid place-items-center text-gold font-bold text-[13px]">
                  {i + 1}
                </div>
                <h3 className="text-white font-semibold text-[15px] mt-5">{step.title}</h3>
                <p className="text-mute text-[12.5px] leading-relaxed mt-2.5">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ----------------------------- TESTIMONIALS -------------------------- */}
      <section className="border-y border-line bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <Reveal>
            <SectionLabel>Client feedback</SectionLabel>
            <h2 className="font-display text-white text-[32px] md:text-[44px] leading-[1.1] max-w-2xl">
              Judged on the shifts nobody sees.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.org} delay={i * 80}>
                <figure className="h-full rounded-xl border border-line bg-panel p-6 flex flex-col">
                  <Quote size={22} className="text-gold/60" />
                  <blockquote className="text-zinc-300 text-[13.5px] leading-relaxed mt-4 flex-1">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-line-soft">
                    <p className="text-white text-[13px] font-semibold">{t.name}</p>
                    <p className="text-mute text-[11.5px]">{t.org}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- CAREERS ----------------------------- */}
      <section className="relative isolate overflow-hidden border-y border-line">
        <Backdrop variant="crest" className="-z-10" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Reveal className="max-w-xl">
            <SectionLabel>Careers</SectionLabel>
            <h2 className="font-display text-white text-[34px] md:text-[46px] leading-[1.08]">
              Join the Matsika officer network.
            </h2>
            <p className="text-zinc-300 text-[14.5px] leading-relaxed mt-5">
              Register your PSiRA grading, experience and documents once. Our recruitment team
              verifies your profile and matches you to contracts as they open — permanent, contract
              and relief work across all nine provinces.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <BtnLink href="/careers/apply" size="lg">
                Register Now <ArrowRight size={16} />
              </BtnLink>
              <BtnLink href="/careers" variant="outline" size="lg">
                View Open Positions
              </BtnLink>
            </div>
            <p className="text-mute text-[11.5px] leading-relaxed mt-6 max-w-md">
              Registration does not constitute registration with PSiRA and does not guarantee
              employment or deployment. PSiRA status is independently verified where required.
            </p>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------- FAQ ------------------------------- */}
      <section className="mx-auto max-w-4xl px-6 py-20 md:py-24">
        <Reveal className="text-center">
          <SectionLabel>
            <span className="block text-center">Questions</span>
          </SectionLabel>
          <h2 className="font-display text-white text-[32px] md:text-[42px] leading-[1.1]">
            Straight answers, no small print.
          </h2>
        </Reveal>
        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 50}>
              <details className="group py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="text-white font-semibold text-[14.5px]">{f.q}</span>
                  <ChevronRight
                    size={16}
                    className="text-gold shrink-0 transition-transform group-open:rotate-90"
                  />
                </summary>
                <p className="text-mist text-[13.5px] leading-relaxed mt-3 pr-8">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------ FINAL CTA ---------------------------- */}
      <section className="border-t border-line bg-linear-to-b from-[#0A0A0B] to-black">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24 text-center">
          <Reveal>
            <h2 className="font-display text-white text-[34px] md:text-[50px] leading-[1.07]">
              Let us survey your site. <span className="gold-text">At no cost.</span>
            </h2>
            <p className="text-mist text-[14.5px] leading-relaxed mt-5 max-w-xl mx-auto">
              A Matsika risk consultant will walk your property, photograph every exposure point and
              hand you a costed security plan — whether or not you appoint us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">
              <BtnLink href="/contact" size="lg">
                Book My Free Survey <ArrowRight size={16} />
              </BtnLink>
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md border border-gold/55 text-gold-soft text-[13.5px] font-semibold uppercase tracking-[0.13em] hover:bg-gold/10"
              >
                Call {COMPANY.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
