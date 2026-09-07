import type { Metadata } from "next";
import { Suspense } from "react";
import { Building2, Clock, Loader2, Mail, MapPin, Phone, ShieldCheck, Siren } from "lucide-react";
import QuoteForm from "@/components/site/QuoteForm";
import { Card, Reveal, SectionLabel } from "@/components/ui";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact & Free Site Survey",
  description:
    "Request a free security risk survey or speak to the Matsika Protective Services 24/7 national control room.",
};

// Regional branch offices — ported over from the alternate redesign concept.
// Update with your real branch addresses/phone numbers before going live.
const OFFICES = [
  {
    city: "Johannesburg (Head Office)",
    line1: COMPANY.address,
    phone: COMPANY.phone,
  },
  { city: "Pretoria", line1: "Block C, Centurion Business Park, Centurion, 0157", phone: "012 663 4100" },
  { city: "Cape Town", line1: "8 Long Street, Foreshore, Cape Town, 8001", phone: "021 424 8800" },
  { city: "Durban", line1: "45 Umhlanga Ridge, Umhlanga, 4319", phone: "031 566 1200" },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative border-b border-line bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Reveal className="max-w-3xl">
            <SectionLabel>Contact</SectionLabel>
            <h1 className="font-display text-white text-[40px] md:text-[56px] leading-[1.05]">
              Talk to a consultant, <span className="gold-text">not a call centre.</span>
            </h1>
            <p className="text-mist text-[15px] leading-relaxed mt-5 max-w-2xl">
              Tell us what you need protected. We will respond within one business hour — or
              immediately if this is an emergency.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-14 md:py-20 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Suspense
            fallback={
              <div className="min-h-[400px] grid place-items-center">
                <Loader2 size={22} className="animate-spin text-gold" />
              </div>
            }
          >
            <QuoteForm />
          </Suspense>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 border-gold/30 bg-linear-to-br from-[#12100A] to-panel">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 grid place-items-center pulse-gold">
                <Siren size={15} className="text-gold" />
              </span>
              <h2 className="text-white font-semibold text-[15px]">Emergency dispatch</h2>
            </div>
            <p className="text-mute text-[12.5px] leading-relaxed mt-3">
              Active incident, alarm activation or armed response required? Call the control room
              directly — it is manned every hour of the year.
            </p>
            <a
              href={`tel:${COMPANY.emergency.replace(/\s/g, "")}`}
              className="block font-display text-gold text-[30px] mt-3 hover:text-gold-light"
            >
              {COMPANY.emergency}
            </a>
          </Card>

          <Card className="p-6">
            <h2 className="text-white font-semibold text-[15px] mb-4">Head office</h2>
            <ul className="space-y-3.5 text-[13px] text-mist">
              <li className="flex gap-3">
                <MapPin size={15} className="text-gold shrink-0 mt-0.5" /> {COMPANY.address}
              </li>
              <li className="flex gap-3">
                <Phone size={15} className="text-gold shrink-0 mt-0.5" />
                <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={15} className="text-gold shrink-0 mt-0.5" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-gold">
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={15} className="text-gold shrink-0 mt-0.5" />
                <a href={`mailto:${COMPANY.careersEmail}`} className="hover:text-gold">
                  {COMPANY.careersEmail}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={15} className="text-gold shrink-0 mt-0.5" /> {COMPANY.hours}
              </li>
              <li className="flex gap-3">
                <ShieldCheck size={15} className="text-gold shrink-0 mt-0.5" /> {COMPANY.psira}
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-white font-semibold text-[15px] mb-3">What happens next</h2>
            <ol className="space-y-3">
              {[
                "We call you back to confirm scope and access.",
                "A consultant surveys the site and photographs exposure points.",
                "You receive a written, costed security plan within 48 hours.",
                "Mobilisation can begin as soon as you approve it.",
              ].map((s, i) => (
                <li key={s} className="flex gap-3 text-[12.5px] text-mist">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-gold/12 border border-gold/30 text-gold grid place-items-center text-[10.5px] font-bold">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <div className="border-t border-line bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <Reveal>
            <SectionLabel>Our Branches</SectionLabel>
            <h2 className="font-display text-white text-[26px] md:text-[32px] leading-[1.1] mt-2">
              National footprint, <span className="gold-text">local response.</span>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {OFFICES.map((office) => (
              <Card key={office.city} className="p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-8 rounded-full bg-gold/12 border border-gold/30 grid place-items-center">
                    <Building2 size={14} className="text-gold" />
                  </span>
                  <h3 className="text-white font-semibold text-[13.5px]">{office.city}</h3>
                </div>
                <p className="text-mute text-[12px] leading-relaxed">{office.line1}</p>
                <a
                  href={`tel:${office.phone.replace(/\s/g, "")}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-gold hover:text-gold-light"
                >
                  <Phone size={12} /> {office.phone}
                </a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
