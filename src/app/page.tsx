import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Camera,
  Check,
  ClipboardCheck,
  Factory,
  Radio,
  Shield,
  Users,
} from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import ContactForm from "@/components/contact-form";
import Logo from "@/components/logo";
import { Reveal } from "@/components/ui";
import { HeroMedia, Spotlight } from "@/components/motion";

const services = [
  {
    icon: Shield,
    title: "Manned Guarding",
    text: "Site-specific security officers for access points, reception areas, perimeters and internal patrols.",
  },
  {
    icon: Building2,
    title: "Access Control",
    text: "Visitor, contractor, vehicle and delivery controls supported by clear site procedures and records.",
  },
  {
    icon: Camera,
    title: "CCTV Monitoring",
    text: "Camera monitoring, incident verification and escalation aligned with your existing security infrastructure.",
  },
  {
    icon: Radio,
    title: "Response Coordination",
    text: "Defined escalation procedures, control-room communication and coordination with emergency services.",
  },
  {
    icon: Users,
    title: "Event Security",
    text: "Professional access management, crowd control and operational security for corporate and public events.",
  },
  {
    icon: ClipboardCheck,
    title: "Risk Assessments",
    text: "Practical reviews of physical, procedural and personnel risks, followed by a written recommendation.",
  },
];

const sectors = [
  "Corporate offices",
  "Industrial facilities",
  "Logistics and warehouses",
  "Retail properties",
  "Residential estates",
  "Construction sites",
  "Education and healthcare",
  "Events and hospitality",
];

const principles = [
  ["01", "Site-led planning", "The security plan is based on your operating environment and risk exposure."],
  ["02", "Verified personnel", "Officer information and PSiRA status are reviewed before placement."],
  ["03", "Management oversight", "Post instructions, reporting and escalation are managed as part of the service."],
];

const controls = [
  "Site-specific post instructions and escalation procedures",
  "Occurrence reporting and incident documentation",
  "Supervisor oversight and service reviews",
  "Coordination with client representatives and emergency services",
];

export default function HomePage() {
  return (
    <div className="bg-ink text-cream">
      <SiteNav />

      <main>
        <section className="relative min-h-[690px] overflow-hidden border-b border-line">
          <HeroMedia src="/images/real/corporate-building.jpg" alt="Modern commercial property at night" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black via-black/80 to-transparent lg:w-4/5" />

          <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-12 px-6 py-20 md:px-8 lg:grid-cols-[1fr_340px]">
            <div className="max-w-3xl">
              <p className="rise rise-1 mb-6 text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                Professional security services
              </p>
              <h1 className="rise rise-2 max-w-3xl text-[42px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[54px] lg:text-[66px]">
                Security management for organisations that cannot afford uncertainty.
              </h1>
              <p className="rise rise-3 mt-7 max-w-2xl text-[16px] leading-7 text-[#c8c8c8]">
                Matsika Protective Services provides guarding, access control, monitoring and risk management for commercial, industrial and residential clients. Every assignment begins with the site, the risk and the required business outcome.
              </p>
              <div className="rise rise-4 mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn-arrow inline-flex items-center justify-center gap-2 bg-gold px-7 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors duration-200 hover:bg-gold-pale"
                >
                  Request a security proposal <ArrowRight size={15} />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center border border-white/35 bg-black/30 px-7 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-gold hover:text-gold"
                >
                  Review our services
                </Link>
              </div>
            </div>

            <div className="rise rise-5 hidden border border-gold/50 bg-black/80 p-7 transition-colors duration-300 hover:border-gold lg:block">
              <div className="flex justify-center border-b border-line pb-6">
                <Logo size={180} />
              </div>
              <div className="pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold">Operating principle</p>
                <p className="mt-3 text-[15px] font-semibold leading-6 text-white">
                  Clear responsibility. Documented procedures. Accountable service delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden="true">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-dim">Scroll</span>
            <span className="scroll-cue block h-10 w-px bg-gold/70" />
          </div>
        </section>

        <section className="border-b border-line bg-black">
          <div className="mx-auto grid max-w-7xl divide-y divide-line px-6 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-10">
            {principles.map(([number, title, text], i) => (
              <Reveal key={number} delay={i * 110}>
                <div className="group py-12 transition-colors duration-300 hover:bg-white/[0.02] md:px-10 md:first:pl-0 md:last:pr-0">
                  <span className="inline-block text-[11px] font-bold text-gold transition-transform duration-300 group-hover:-translate-y-1 mb-1">{number}</span>
                  <h2 className="mt-4 text-[15px] font-semibold text-white">{title}</h2>
                  <p className="mt-3 text-[13px] leading-7 text-dim">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Core services</p>
              <h2 className="mt-5 text-[34px] font-semibold leading-tight tracking-[-0.025em] text-white">
                One security partner. A service built around your site.
              </h2>
              <p className="mt-5 text-[14px] leading-7 text-dim">
                Services can be contracted individually or combined into a managed security solution with a single point of accountability.
              </p>
              <Link href="/services" className="btn-arrow mt-7 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-gold transition-colors hover:text-gold-pale">
                View service details <ArrowRight size={14} />
              </Link>
            </Reveal>

            <div className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <Reveal key={service.title} delay={(i % 3) * 90} className="h-full">
                  <Spotlight className="lift group h-full border-b border-r border-line">
                    <Link href="/services" className="block h-full p-7">
                      <span className="inline-flex border border-line2 p-3 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                        <service.icon size={20} strokeWidth={1.6} />
                      </span>
                      <h3 className="mt-6 text-[15px] font-semibold text-white">{service.title}</h3>
                      <p className="mt-3 text-[13px] leading-6 text-dim">{service.text}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-gold opacity-0 transition-all duration-300 group-hover:opacity-100">
                        View service <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Spotlight>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-coal">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
            <Reveal className="relative min-h-[460px] overflow-hidden">
              <div className="img-frame absolute inset-0">
                <img
                  src="/images/real/control-room.jpg"
                  alt="Security monitoring control room"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
            </Reveal>
            <div className="px-6 py-16 md:px-12 lg:py-20">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Operational control</p>
                <h2 className="mt-5 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-white">
                  Security activity must be visible, recorded and acted upon.
                </h2>
                <p className="mt-5 text-[14px] leading-7 text-mist">
                  A guarding contract is only effective when communication, supervision and reporting work together. We establish practical controls for each assignment and define how incidents move from detection to resolution.
                </p>
              </Reveal>
              <div className="mt-8 space-y-4">
                {controls.map((item, i) => (
                  <Reveal key={item} delay={i * 80}>
                    <div className="check-row flex items-start gap-3 border-b border-line pb-4 text-[13px] leading-6 text-mist last:border-0 last:pb-0 hover:border-gold/60">
                      <Check size={15} className="mt-1 shrink-0 text-gold" /> {item}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Client environments</p>
              <h2 className="mt-5 text-[34px] font-semibold leading-tight tracking-[-0.025em] text-white">
                Security for active business environments.
              </h2>
              <p className="mt-5 max-w-xl text-[14px] leading-7 text-dim">
                Our approach considers people, operating hours, deliveries, contractors, customers, assets and the practical demands of keeping your organisation running.
              </p>
              <div className="mt-9 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
                {sectors.map((sector, i) => (
                  <Reveal key={sector} delay={i * 45}>
                    <div className="group flex items-center gap-3 border-b border-r border-line px-5 py-4 text-[13px] font-medium text-mist transition-colors duration-300 hover:bg-panel2 hover:text-cream">
                      <span className="h-1.5 w-1.5 shrink-0 bg-gold transition-transform duration-300 group-hover:scale-150" /> {sector}
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="img-frame">
                <img
                  src="/images/real/industrial-site.jpg"
                  alt="Industrial facility requiring professional security management"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="border border-t-0 border-line bg-panel p-6 transition-colors duration-300 hover:border-gold/60">
                <div className="flex items-start gap-4">
                  <Factory size={20} className="mt-0.5 shrink-0 text-gold" />
                  <p className="text-[13px] leading-6 text-mist">
                    Industrial and logistics sites require disciplined gate controls, accurate vehicle records and patrol procedures that support—not obstruct—operations.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-line bg-black">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Procurement and management</p>
                <h2 className="mt-5 max-w-2xl text-[32px] font-semibold leading-tight tracking-[-0.025em] text-white">
                  A proposal your management team can properly evaluate.
                </h2>
                <p className="mt-5 max-w-2xl text-[14px] leading-7 text-dim">
                  We assess the property, define the scope, identify responsibilities and provide a written recommendation. The objective is a clear operating model—not a generic guard quotation.
                </p>
              </Reveal>
              <Reveal delay={140}>
                <div className="border-l-2 border-gold pl-7">
                  <p className="text-[13px] font-semibold leading-6 text-white">A standard proposal can include:</p>
                  <ul className="mt-4 space-y-2 text-[13px] leading-6 text-mist">
                    <li className="check-row">Risk and site requirements</li>
                    <li className="check-row">Recommended staffing and shifts</li>
                    <li className="check-row">Post duties and management structure</li>
                    <li className="check-row">Reporting and escalation arrangements</li>
                    <li className="check-row">Commercial scope and implementation plan</li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:px-8 lg:grid-cols-[380px_1fr]">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Contact Matsika</p>
            <h2 className="mt-5 text-[34px] font-semibold leading-tight tracking-[-0.025em] text-white">
              Discuss your security requirements.
            </h2>
            <p className="mt-5 text-[14px] leading-7 text-dim">
              Provide a short description of your site, operating hours and current concern. A member of our team will contact you to arrange the next step.
            </p>
            <div className="mt-8 border-l-2 border-gold pl-5 transition-colors duration-300 hover:border-gold-pale">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-dim">24-hour contact</p>
              <a href="tel:0860628747" className="mt-2 block text-[22px] font-semibold text-white transition-colors hover:text-gold">0860 628 747</a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
