"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import Logo from "./logo";
import { ScrollProgress } from "./motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "Company" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.55)]" : ""
      }`}
    >
      <ScrollProgress />
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 md:px-8 ${
          scrolled ? "h-[68px]" : "h-[92px]"
        }`}
      >
        <Link
          href="/"
          aria-label="Matsika Protective Services home"
          className="flex h-full items-center transition-opacity hover:opacity-90 [&>span>img]:transition-all [&>span>img]:duration-300"
        >
          <Logo size={scrolled ? 58 : 78} />
        </Link>

        <nav className="hidden h-full items-center lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex h-full items-center px-5 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${
                  active ? "text-gold" : "text-mist hover:text-cream"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-5 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href="tel:0860628747" className="group flex items-center gap-3 text-left">
            <span className="border border-line2 p-2 transition-colors duration-300 group-hover:border-gold">
              <Phone size={15} className="text-gold" />
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-dim">24-hour contact</span>
              <span className="block text-[13px] font-semibold text-cream transition-colors group-hover:text-gold">0860 628 747</span>
            </span>
          </a>
          <Link
            href="/contact"
            className="btn-arrow inline-flex items-center gap-2 border border-gold bg-gold px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:border-gold-pale hover:bg-gold-pale"
          >
            Request a proposal <ArrowRight size={14} />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="border border-line2 p-3 text-cream transition-colors hover:border-gold hover:text-gold lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="border-t border-line bg-coal">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 md:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gold">
            PSiRA-registered security service provider
          </p>
          <p className="hidden text-[10px] uppercase tracking-[0.1em] text-dim sm:block">
            Commercial · Industrial · Residential · Events
          </p>
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-line bg-ink px-5 py-5">
            <nav className="flex flex-col">
              {links.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                  className={`border-b border-line py-4 text-[14px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:pl-2 hover:text-gold ${
                    open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  } ${pathname === link.href ? "text-gold" : "text-cream"}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <a
              href="tel:0860628747"
              className="mt-5 flex items-center justify-center gap-2 border border-gold px-5 py-3 text-[13px] font-semibold text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              <Phone size={15} /> 0860 628 747
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
