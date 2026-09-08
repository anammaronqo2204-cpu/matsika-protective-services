import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./logo";
import { BackToTop } from "./motion";
import { COMPANY } from "@/lib/constants";

const serviceLinks = [
  "Manned guarding",
  "Access control",
  "CCTV monitoring",
  "Event security",
  "Risk assessments",
];

const companyLinks = [
  { href: "/about", label: "About Matsika" },
  { href: "/careers", label: "Careers" },
  { href: "/apply", label: "Officer applications" },
  { href: "/status", label: "Application status" },
  { href: "/contact", label: "Contact" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-gold bg-coal">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size={112} />
          <p className="mt-5 max-w-xs text-[13px] leading-6 text-dim">
            Professional security services for businesses, properties, facilities and events.
          </p>
        </div>
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold">Services</h3>
          <ul className="mt-5 space-y-3 text-[13px] text-mist">
            {serviceLinks.map((label) => (
              <li key={label}>
                <Link href="/services" className="u-line">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold">Company</h3>
          <ul className="mt-5 space-y-3 text-[13px] text-mist">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="u-line">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold">Contact</h3>
          <ul className="mt-5 space-y-4 text-[13px] leading-5 text-mist">
            <li>
              <a href={`tel:${COMPANY.emergency.replace(/\s/g, "")}`} className="group flex gap-3 transition-transform duration-300 hover:translate-x-1">
                <Phone size={15} className="mt-0.5 shrink-0 text-gold" />
                <span className="transition-colors group-hover:text-cream">{COMPANY.emergency}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="group flex gap-3 transition-transform duration-300 hover:translate-x-1">
                <Mail size={15} className="mt-0.5 shrink-0 text-gold" />
                <span className="transition-colors group-hover:text-cream">{COMPANY.email}</span>
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin size={15} className="mt-0.5 shrink-0 text-gold" /> {COMPANY.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 py-5 text-[11px] text-faint md:flex-row">
          <span>© {new Date().getFullYear()} {COMPANY.legal}. All rights reserved.</span>
          <span>Professional security services · South Africa</span>
        </div>
      </div>
      <BackToTop />
    </footer>
  );
}
