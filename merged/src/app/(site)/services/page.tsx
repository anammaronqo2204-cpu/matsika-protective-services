import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { BtnLink, Reveal, SectionLabel } from "@/components/ui";
import ServiceIcon from "@/components/site/ServiceIcon";
import Backdrop from "@/components/site/Backdrop";
import { COMPANY, SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Security Services",
  description:
    "Manned guarding, armed response, CCTV and off-site monitoring, access control, VIP protection, event safety, risk assessment and specialised security operations.",
};

const IMAGES: Record<string, string> = {
  "manned-guarding": "/images/guarding.jpg",
  "cctv-remote-monitoring": "/images/control-room.jpg",
};

/** Services rendered with our own SVG crest backdrop rather than photography. */
const BACKDROPS: Record<string, "crest" | "radar"> = {
  "armed-response": "radar",
  "vip-protection": "crest",
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative border-b border-line bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
          <Reveal className="max-w-3xl">
            <SectionLabel>Capabilities</SectionLabel>
            <h1 className="font-display text-white text-[40px] md:text-[58px] leading-[1.05]">
              Layered protection, <span className="gold-text">single accountability.</span>
            </h1>
            <p className="text-mist text-[15px] leading-relaxed mt-6 max-w-2xl">
              Each service below can be deployed on its own or integrated into a single security
              plan with one contract, one service manager and one monthly performance review.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 space-y-5">
        {SERVICES.map((s, i) => {
          const img = IMAGES[s.slug];
          const backdrop = BACKDROPS[s.slug];
          const hasVisual = Boolean(img || backdrop);
          return (
            <Reveal key={s.slug} delay={40}>
              <article
                id={s.slug}
                className="scroll-mt-28 rounded-2xl border border-line bg-panel overflow-hidden grid lg:grid-cols-12"
              >
                <div className={hasVisual ? "lg:col-span-7 p-7 md:p-10" : "lg:col-span-12 p-7 md:p-10"}>
                  <div className="flex items-start gap-4">
                    <span className="inline-grid place-items-center w-12 h-12 rounded-xl border border-gold/25 bg-gold/8 text-gold shrink-0">
                      <ServiceIcon name={s.icon} size={21} />
                    </span>
                    <div>
                      <p className="text-[11px] font-mono text-gold/60">
                        {String(i + 1).padStart(2, "0")} / Service
                      </p>
                      <h2 className="font-display text-white text-[27px] md:text-[32px] leading-tight mt-1">
                        {s.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-mist text-[14px] leading-relaxed mt-6">{s.body}</p>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mt-7">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[13px] text-zinc-300">
                        <CheckCircle2 size={15} className="text-gold shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 mt-8">
                    <BtnLink href={`/contact?service=${encodeURIComponent(s.title)}`}>
                      Request this service <ArrowRight size={14} />
                    </BtnLink>
                    <a
                      href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-line text-mist text-[13px] font-semibold hover:border-gold/50 hover:text-gold-soft"
                    >
                      <Phone size={13} /> Speak to a consultant
                    </a>
                  </div>
                </div>

                {img ? (
                  <div className="lg:col-span-5 relative min-h-[240px]">
                    <Image src={img} alt={s.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-l from-black/80 via-black/20 to-transparent" />
                  </div>
                ) : backdrop ? (
                  <div className="lg:col-span-5 relative min-h-[240px]">
                    <Backdrop variant={backdrop} />
                  </div>
                ) : null}
              </article>
            </Reveal>
          );
        })}
      </div>

      <section className="border-t border-line bg-[#050505]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-white text-[32px] md:text-[44px] leading-[1.08]">
              Not sure which layer you actually need?
            </h2>
            <p className="text-mist text-[14.5px] mt-5 max-w-xl mx-auto leading-relaxed">
              Start with the risk survey. We will tell you honestly where your exposure is — and
              where you are already spending money you do not need to.
            </p>
            <div className="mt-8">
              <BtnLink href="/contact" size="lg">
                Book a Free Risk Survey <ArrowRight size={16} />
              </BtnLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
