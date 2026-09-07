"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, ShieldCheck, X } from "lucide-react";
import { COMPANY, SERVICES } from "@/lib/constants";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services", mega: true },
  { href: "/sectors", label: "Sectors" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

/**
 * Logo
 * The crest asset is 268x256 (ratio ~1.047) with a transparent background,
 * so we drive it off a height and let the width follow the true aspect.
 */
export function Logo({ size = 44, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Image
        src="/images/logo.png"
        alt="Matsika Protective Services"
        width={Math.round(size * 1.047)}
        height={size}
        className="object-contain shrink-0"
        style={{ height: size, width: "auto" }}
        priority
      />
      {showText && (
        <span className="leading-none">
          <span
            className="block font-display text-white tracking-[0.14em] whitespace-nowrap"
            style={{ fontSize: Math.round(size * 0.42) }}
          >
            MATSIKA
          </span>
          <span
            className="block text-gold font-bold uppercase whitespace-nowrap mt-[3px]"
            style={{ fontSize: Math.max(7.5, size * 0.166), letterSpacing: "0.22em" }}
          >
            Protective Services
          </span>
        </span>
      )}
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* ------------------------------ Utility bar -----------------------------
          Deliberately sparse: one trust statement on the left, one way to reach
          us on the right. Hidden below xl so it can never wrap onto two lines. */}
      <div className="hidden xl:block bg-[#040404] border-b border-line-soft">
        <div className="mx-auto max-w-7xl px-6 h-10 flex items-center justify-between gap-8 text-[11.5px] whitespace-nowrap">
          <span className="inline-flex items-center gap-2 text-mute">
            <ShieldCheck size={13} className="text-gold shrink-0" />
            <span className="text-gold-soft font-medium">PSiRA-Registered Security Provider</span>
            <span className="text-line">|</span>
            <span>POPIA Compliant</span>
          </span>

          <span className="inline-flex items-center gap-2 text-mute">
            <a href={`mailto:${COMPANY.email}`} className="hover:text-gold-soft">
              {COMPANY.email}
            </a>
            <span className="text-line">|</span>
            <Phone size={12} className="text-gold shrink-0" />
            <span>24/7 Control Room</span>
            <a
              href={`tel:${COMPANY.emergency.replace(/\s/g, "")}`}
              className="text-gold font-bold tracking-wide hover:text-gold-light"
            >
              {COMPANY.emergency}
            </a>
          </span>
        </div>
      </div>

      {/* -------------------------------- Main bar ------------------------------ */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "bg-black/93 backdrop-blur-md border-line"
            : "bg-black/75 backdrop-blur-sm border-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-6 flex items-center justify-between gap-6 h-[70px] md:h-[84px]">
          <Link href="/" aria-label="Matsika Protective Services home" className="shrink-0">
            <Logo size={scrolled ? 44 : 52} />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((item) => {
              const active = pathname === item.href;
              if (item.mega) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-semibold transition-colors whitespace-nowrap ${
                        active ? "text-gold" : "text-zinc-300 hover:text-gold"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={13}
                        className={megaOpen ? "rotate-180 transition" : "transition"}
                      />
                    </Link>
                    {megaOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[620px]">
                        <div className="bg-[#0B0B0D] border border-line rounded-xl p-3 shadow-2xl shadow-black grid grid-cols-2 gap-1">
                          {SERVICES.map((s) => (
                            <Link
                              key={s.slug}
                              href={`/services#${s.slug}`}
                              className="group rounded-lg px-3 py-2.5 hover:bg-gold/8 transition-colors"
                            >
                              <span className="block text-[13px] font-semibold text-white group-hover:text-gold">
                                {s.title}
                              </span>
                              <span className="block text-[11.5px] text-mute leading-snug mt-0.5">
                                {s.short}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-colors whitespace-nowrap ${
                    active ? "text-gold" : "text-zinc-300 hover:text-gold"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/careers/status"
              className="text-[12.5px] font-semibold text-mist hover:text-white whitespace-nowrap"
            >
              Track Application
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-[12.5px] font-bold uppercase tracking-[0.11em] whitespace-nowrap bg-linear-to-b from-[#E9C85A] to-[#C9A227] text-black hover:from-[#F3DD93] hover:to-[#D6AE33] shadow-[0_10px_30px_-14px_rgba(201,162,39,0.9)]"
            >
              Get a Quote
            </Link>
          </div>

          <button
            className="lg:hidden p-2 -mr-2 text-gold-soft shrink-0"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ------------------------------ Mobile drawer --------------------------- */}
      {open && (
        <div className="lg:hidden bg-[#08080A] border-b border-line px-5 py-4 max-h-[calc(100vh-70px)] overflow-y-auto">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-[15px] font-semibold text-zinc-200 border-b border-line-soft"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/careers/status"
              className="py-3 text-[15px] font-semibold text-zinc-200 border-b border-line-soft"
            >
              Track Application
            </Link>
          </nav>

          <div className="grid grid-cols-2 gap-2 mt-5">
            <a
              href={`tel:${COMPANY.emergency.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 py-3.5 rounded-md border border-gold/50 text-gold-soft text-[12.5px] font-bold"
            >
              <Phone size={14} /> Emergency
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center py-3.5 rounded-md bg-linear-to-b from-[#E9C85A] to-[#C9A227] text-black text-[12.5px] font-bold uppercase tracking-[0.1em]"
            >
              Get a Quote
            </Link>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 text-[11px] text-mute">
            <ShieldCheck size={12} className="text-gold" /> PSiRA-Registered · POPIA Compliant
          </p>
        </div>
      )}
    </header>
  );
}
