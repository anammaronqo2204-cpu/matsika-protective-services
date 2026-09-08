import Link from "next/link";
import { ArrowRight, Camera, Check, ClipboardCheck, KeyRound, Radio, Shield, Users } from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import { Reveal } from "@/components/ui";
import { Spotlight } from "@/components/motion";

const services = [
  {
    number: "01",
    icon: Shield,
    title: "Manned guarding",
    description: "Trained security officers deployed according to the operational requirements and risk profile of the site.",
    points: ["Access-point and gatehouse duties", "Reception and visitor management", "Internal and perimeter patrols", "Opening and closing procedures", "Occurrence and incident reporting"],
  },
  {
    number: "02",
    icon: KeyRound,
    title: "Access control",
    description: "Controlled movement of employees, visitors, contractors, deliveries and vehicles through defined procedures.",
    points: ["Visitor and contractor records", "Vehicle and delivery verification", "Key and asset registers", "Search procedures where authorised", "After-hours access controls"],
  },
  {
    number: "03",
    icon: Camera,
    title: "CCTV monitoring",
    description: "Monitoring and incident verification designed to support on-site personnel and existing security infrastructure.",
    points: ["Live camera observation", "Incident verification and escalation", "Recorded evidence management", "Control-room communication", "System and camera exception reporting"],
  },
  {
    number: "04",
    icon: Radio,
    title: "Response coordination",
    description: "Clear communication and escalation between site personnel, management, response resources and emergency services.",
    points: ["Defined escalation procedures", "Incident command communication", "Client representative notification", "Emergency service coordination", "Post-incident documentation"],
  },
  {
    number: "05",
    icon: Users,
    title: "Event security",
    description: "Security planning and personnel for corporate functions, venues, public events and controlled gatherings.",
    points: ["Entry and accreditation control", "Crowd and queue management", "Restricted-area management", "Emergency route protection", "Operational event briefings"],
  },
  {
    number: "06",
    icon: ClipboardCheck,
    title: "Risk assessments",
    description: "A structured review of physical security, procedures, staffing and operational exposure.",
    points: ["Site inspection", "Risk and vulnerability identification", "Review of current controls", "Written recommendations", "Implementation priorities"],
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-ink text-cream">
      <SiteNav />
      <main>
        <section className="border-b border-line bg-black">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:px-8 lg:grid-cols-[1fr_430px] lg:items-end">
            <div>
              <p className="rise rise-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Security services</p>
              <h1 className="rise rise-2 mt-6 max-w-3xl text-[42px] font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-[56px]">
                Practical protection for complex operating environments.
              </h1>
            </div>
            <p className="rise rise-3 border-l-2 border-gold pl-6 text-[14px] leading-7 text-mist">
              Each service is scoped against the site, operating hours, people, assets and risk. Services may be contracted separately or combined under one management structure.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
          <div className="grid gap-0 border-l border-t border-line lg:grid-cols-2">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={(i % 2) * 100}>
                <Spotlight className="lift group h-full border-b border-r border-line p-7 md:p-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex border border-line2 p-3 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <service.icon size={22} strokeWidth={1.5} />
                    </span>
                    <span className="text-[11px] font-bold text-gold transition-transform duration-300 group-hover:-translate-y-1">{service.number}</span>
                  </div>
                  <h2 className="mt-8 text-[22px] font-semibold tracking-[-0.02em] text-white">{service.title}</h2>
                  <p className="mt-4 max-w-xl text-[14px] leading-7 text-dim">{service.description}</p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {service.points.map((point) => (
                      <li key={point} className="check-row flex items-start gap-3 text-[13px] leading-5 text-mist">
                        <Check size={14} className="mt-0.5 shrink-0 text-gold" /> {point}
                      </li>
                    ))}
                  </ul>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-y border-line bg-coal">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
            <Reveal className="relative min-h-[420px] overflow-hidden">
              <div className="img-frame absolute inset-0">
                <img src="/images/real/cctv-camera.jpg" alt="Commercial CCTV camera installation" className="h-full w-full object-cover" />
              </div>
            </Reveal>
            <div className="px-6 py-16 md:px-12 lg:py-20">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Integrated delivery</p>
                <h2 className="mt-5 text-[32px] font-semibold leading-tight tracking-[-0.025em] text-white">
                  People, procedures and technology must work as one system.
                </h2>
                <p className="mt-5 text-[14px] leading-7 text-mist">
                  Cameras do not replace disciplined personnel, and personnel cannot perform without clear procedures. We define how each part of the security operation supports the others, including responsibility for detection, communication, escalation and reporting.
                </p>
                <Link href="/contact" className="btn-arrow mt-8 inline-flex items-center gap-2 bg-gold px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors duration-200 hover:bg-gold-pale">
                  Discuss your requirements <ArrowRight size={14} />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
