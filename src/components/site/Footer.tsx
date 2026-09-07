import Link from "next/link";
import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/site/Header";
import { ACCREDITATIONS, COMPANY, SERVICES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#050505]">
      {/* Emergency strip */}
      <div className="border-b border-line-soft bg-linear-to-r from-[#0B0B0D] via-[#121006] to-[#0B0B0D]">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <span className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 grid place-items-center pulse-gold">
              <Phone size={15} className="text-gold" />
            </span>
            <div>
              <p className="text-white font-semibold text-[14px]">
                24/7 National Control Room &amp; Emergency Dispatch
              </p>
              <p className="text-mute text-[12px]">
                Verified alarm escalation, armed response and incident command.
              </p>
            </div>
          </div>
          <a
            href={`tel:${COMPANY.emergency.replace(/\s/g, "")}`}
            className="font-display text-gold text-[26px] tracking-wide hover:text-gold-light"
          >
            {COMPANY.emergency}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size={44} />
          <p className="text-mute text-[12.5px] leading-relaxed mt-5">
            {COMPANY.name} is a security services division and trading identity of{" "}
            <span className="text-mist">{COMPANY.legal}</span>. We protect people, assets and
            reputations across South Africa with graded officers, technology and disciplined
            supervision.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-[11.5px] text-gold-soft">
            <ShieldCheck size={13} className="text-gold" /> {COMPANY.psira}
          </p>
        </div>

        <div>
          <h4 className="text-white text-[12px] font-bold uppercase tracking-[0.18em] mb-4">
            Services
          </h4>
          <ul className="space-y-2">
            {SERVICES.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services#${s.slug}`}
                  className="text-mute text-[12.5px] hover:text-gold transition-colors"
                >
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="text-gold-soft text-[12.5px] hover:text-gold">
                All services →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-[12px] font-bold uppercase tracking-[0.18em] mb-4">
            Company
          </h4>
          <ul className="space-y-2">
            {[
              { href: "/about", label: "About Matsika" },
              { href: "/sectors", label: "Sectors We Protect" },
              { href: "/careers", label: "Careers & Talent Pool" },
              { href: "/careers/apply", label: "Register as an Officer" },
              { href: "/careers/status", label: "Track Your Application" },
              { href: "/contact", label: "Request a Quote" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-mute text-[12.5px] hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-[12px] font-bold uppercase tracking-[0.18em] mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-[12.5px] text-mute">
            <li className="flex gap-2.5">
              <MapPin size={14} className="text-gold shrink-0 mt-0.5" /> {COMPANY.address}
            </li>
            <li className="flex gap-2.5">
              <Phone size={14} className="text-gold shrink-0 mt-0.5" />
              <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                {COMPANY.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail size={14} className="text-gold shrink-0 mt-0.5" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-gold">
                {COMPANY.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock size={14} className="text-gold shrink-0 mt-0.5" /> {COMPANY.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line-soft">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {ACCREDITATIONS.map((a) => (
            <span key={a} className="text-[10.5px] tracking-[0.2em] uppercase text-mute">
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-line-soft">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#5A5A5A]">
            © {new Date().getFullYear()} {COMPANY.legal}. {COMPANY.tagline}
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-mute">
            <Link href="/legal#privacy" className="hover:text-gold">
              Privacy Notice
            </Link>
            <Link href="/legal#popia" className="hover:text-gold">
              POPIA Notice
            </Link>
            <Link href="/legal#terms" className="hover:text-gold">
              Terms of Use
            </Link>
            <Link href="/legal#retention" className="hover:text-gold">
              Data Retention
            </Link>
            <Link href="/legal#rights" className="hover:text-gold">
              Candidate Rights
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
