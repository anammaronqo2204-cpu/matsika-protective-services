import Link from "next/link";
import { ArrowRight, Check, Search } from "lucide-react";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import Logo from "@/components/logo";
import { Reveal } from "@/components/ui";

const requirements = [
  "Valid South African identity document or lawful work authorisation",
  "Current PSiRA registration where required for the role",
  "Relevant security training and grade certificates",
  "Traceable employment references",
  "Ability to work the shifts and location stated in your profile",
  "Professional conduct and clear communication",
];

const steps = [
  ["01", "Register", "Complete your personal, security, training and availability information."],
  ["02", "Document review", "The recruitment team reviews the information and supporting documents supplied."],
  ["03", "Verification", "PSiRA status, qualifications and references may be independently checked."],
  ["04", "Consideration", "Suitable candidates may be contacted when an assignment matches their profile."],
];

export default function CareersPage() {
  return (
    <div className="bg-ink text-cream">
      <SiteNav />
      <main>
        <section className="border-b border-line bg-black">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:px-8 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <p className="rise rise-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Officer recruitment</p>
              <h1 className="rise rise-2 mt-6 max-w-3xl text-[42px] font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-[56px]">
                Build your security career with Matsika.
              </h1>
              <p className="rise rise-3 mt-6 max-w-2xl text-[15px] leading-7 text-mist">
                Register your professional profile for consideration for current and future security assignments. Applications are reviewed against site requirements, experience, availability and verified documentation.
              </p>
              <div className="rise rise-4 mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/apply" className="btn-arrow inline-flex items-center justify-center gap-2 bg-gold px-7 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors duration-200 hover:bg-gold-pale">
                  Submit your profile <ArrowRight size={14} />
                </Link>
                <Link href="/status" className="inline-flex items-center justify-center gap-2 border border-line2 px-7 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-gold hover:text-gold">
                  <Search size={14} /> Check application
                </Link>
              </div>
            </div>
            <div className="rise rise-3 hidden justify-center border-l border-line pl-10 lg:flex"><Logo size={210} /></div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Candidate requirements</p>
            <h2 className="mt-5 text-[32px] font-semibold tracking-[-0.025em] text-white">Before you apply</h2>
            <p className="mt-5 text-[14px] leading-7 text-dim">
              Candidates should provide accurate information and be prepared for formal document and reference verification. Requirements may differ by assignment.
            </p>
            <ul className="mt-8 space-y-4">
              {requirements.map((item) => (
                <li key={item} className="check-row flex items-start gap-3 text-[13px] leading-6 text-mist"><Check size={15} className="mt-1 shrink-0 text-gold" /> {item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140}>
            <div className="border border-line bg-panel p-8 transition-colors duration-300 hover:border-gold/50 md:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Application process</p>
              <ol className="mt-8 space-y-7">
                {steps.map(([number, title, text]) => (
                  <li key={number} className="group grid grid-cols-[36px_1fr] gap-4 border-b border-line pb-6 transition-colors last:border-0 last:pb-0 hover:border-gold/50">
                    <span className="text-[12px] font-bold text-gold transition-transform duration-300 group-hover:-translate-y-0.5">{number}</span>
                    <div><h3 className="text-[14px] font-semibold text-white">{title}</h3><p className="mt-2 text-[13px] leading-6 text-dim">{text}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </section>

        <section className="border-y border-line bg-coal">
          <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
            <Reveal>
              <p className="max-w-4xl text-[12px] leading-6 text-dim">
                Registration on the Matsika recruitment platform does not constitute registration with PSiRA and does not guarantee employment or deployment. Candidate information is used for recruitment, verification and possible placement, subject to applicable privacy and employment requirements.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
