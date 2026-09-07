import type { Metadata } from "next";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { BtnLink, Reveal, SectionLabel } from "@/components/ui";
import { SECTORS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sectors We Protect",
  description:
    "Security solutions for residential estates, corporate, retail, industrial, mining, education, healthcare, agriculture and events across South Africa.",
};

const DETAIL: Record<string, { risks: string[]; solution: string }> = {
  "Residential Estates": {
    risks: ["Tailgating at booms", "Perimeter breaches", "Contractor abuse of access"],
    solution: "Access control officers, patrol tours, licence plate recognition and estate rule enforcement.",
  },
  "Commercial & Corporate": {
    risks: ["Unscreened visitors", "After-hours intrusion", "Asset walk-off"],
    solution: "Reception-facing graded officers, visitor management and integrated off-site monitoring.",
  },
  "Retail & Malls": {
    risks: ["Shrinkage and organised theft", "Robbery at cash points", "Crowd surges"],
    solution: "Loss prevention officers, cash-handling escorts, camera analytics and lock-up procedures.",
  },
  "Industrial & Logistics": {
    risks: ["Load tampering", "Yard theft", "Contractor collusion"],
    solution: "Gatehouse screening, seal verification, yard patrols and load-out reconciliation.",
  },
  "Mining & Energy": {
    risks: ["Copper and cable theft", "Perimeter incursion", "Illegal mining activity"],
    solution: "Perimeter integrity teams, thermal camera monitoring and specialised reaction units.",
  },
  "Education & Healthcare": {
    risks: ["Unauthorised campus access", "Aggression at reception", "Pharmacy and equipment theft"],
    solution: "24/7 posts, visitor vetting, de-escalation trained officers and panic escalation.",
  },
  "Agriculture & Rural": {
    risks: ["Farm attacks", "Stock and diesel theft", "Slow response distances"],
    solution: "Farm watch integration, radio networks, rural reaction vehicles and drone-assisted patrols.",
  },
  "Events & Hospitality": {
    risks: ["Crowd crush", "Accreditation fraud", "VIP exposure"],
    solution: "SASREA-aligned planning, search points, crowd flow marshals and close protection teams.",
  },
};

export default function SectorsPage() {
  return (
    <>
      <section className="relative border-b border-line bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
          <Reveal className="max-w-3xl">
            <SectionLabel>Sectors</SectionLabel>
            <h1 className="font-display text-white text-[40px] md:text-[58px] leading-[1.05]">
              We protect the places <span className="gold-text">your business lives in.</span>
            </h1>
            <p className="text-mist text-[15px] leading-relaxed mt-6 max-w-2xl">
              A mine perimeter and a boutique hotel do not share a threat profile. Our deployment
              plans start from the risks that are specific to your environment.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-4">
        {SECTORS.map((s, i) => {
          const d = DETAIL[s.title];
          return (
            <Reveal key={s.title} delay={(i % 2) * 70}>
              <article className="h-full rounded-2xl border border-line bg-panel p-7 hover:border-gold/40 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-white text-[24px]">{s.title}</h2>
                  <span className="text-[11px] font-mono text-gold/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-mute text-[13px] leading-relaxed mt-2.5">{s.body}</p>

                {d && (
                  <>
                    <p className="text-[10.5px] tracking-[0.18em] uppercase text-gold font-bold mt-6 mb-2.5">
                      Typical risk profile
                    </p>
                    <ul className="space-y-1.5">
                      {d.risks.map((r) => (
                        <li key={r} className="flex gap-2 text-[12.5px] text-zinc-300">
                          <ShieldAlert size={14} className="text-[#C4703D] shrink-0 mt-0.5" /> {r}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[12.5px] text-mist leading-relaxed mt-4 pt-4 border-t border-line-soft">
                      <span className="text-gold-soft font-semibold">Our deployment: </span>
                      {d.solution}
                    </p>
                  </>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>

      <section className="border-t border-line bg-[#050505]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-white text-[32px] md:text-[44px] leading-[1.08]">
              Your sector not listed?
            </h2>
            <p className="text-mist text-[14.5px] mt-5 max-w-lg mx-auto leading-relaxed">
              We build bespoke deployments for unusual environments — from film sets to seasonal
              agricultural operations.
            </p>
            <div className="mt-8">
              <BtnLink href="/contact" size="lg">
                Talk to a Consultant <ArrowRight size={16} />
              </BtnLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
