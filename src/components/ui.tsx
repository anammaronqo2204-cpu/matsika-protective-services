"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Check, ChevronDown } from "lucide-react";

/* ------------------------------- Reveal ---------------------------------- */

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------- Buttons --------------------------------- */

type Variant = "primary" | "outline" | "ghost" | "dark" | "danger" | "light";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap";

const SIZES: Record<Size, string> = {
  sm: "px-3.5 py-2 text-[12px]",
  md: "px-5 py-2.5 text-[13px]",
  lg: "px-7 py-3.5 text-[13.5px] uppercase tracking-[0.13em]",
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-linear-to-b from-[#E9C85A] to-[#C9A227] text-[#0A0A0A] hover:from-[#F3DD93] hover:to-[#D6AE33] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_10px_30px_-12px_rgba(201,162,39,0.7)]",
  outline: "border border-gold/55 text-gold-soft hover:bg-gold/10 hover:border-gold",
  ghost: "text-mist hover:text-white hover:bg-white/5",
  dark: "bg-panel border border-line text-gold-soft hover:border-gold/50",
  danger: "border border-[#B5453F]/60 text-[#E3948F] hover:bg-[#B5453F]/10",
  light: "bg-white text-black hover:bg-zinc-200",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button {...props} className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function BtnLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}>
      {children}
    </Link>
  );
}

/* ------------------------------- Inputs ---------------------------------- */

export const inputCls =
  "w-full bg-[#0A0A0C] border border-line focus:border-gold text-white placeholder-[#4A4A4A] rounded-md px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:ring-1 focus:ring-gold/40";

export function Field({
  label,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block mb-4 ${className}`}>
      <span className="block text-[10.5px] tracking-[0.16em] uppercase text-mist mb-1.5 font-bold">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-mute mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${className}`} />;
}

export function TextArea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} min-h-[96px] resize-y ${className}`} />;
}

export function Select({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={`${inputCls} appearance-none pr-9 cursor-pointer ${className}`}>
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mute"
      />
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  required,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`mt-0.5 w-5 h-5 shrink-0 rounded flex items-center justify-center border transition-colors ${
          checked ? "bg-gold border-gold" : "border-[#333] bg-[#0A0A0C] hover:border-gold/60"
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} className="text-black" />}
      </button>
      <span
        className="text-[13px] leading-relaxed text-zinc-300 cursor-pointer"
        onClick={() => onChange(!checked)}
      >
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
    </div>
  );
}

/* -------------------------------- Chrome --------------------------------- */

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`bg-panel border border-line rounded-xl ${className}`}>{children}</div>;
}

export function Badge({
  children,
  color = "#C9A227",
  tone = "solid",
}: {
  children: ReactNode;
  color?: string;
  tone?: "solid" | "soft";
}) {
  if (tone === "soft") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-white/5 text-mist">
        {children}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
      style={{ backgroundColor: color + "22", color, border: `1px solid ${color}55` }}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="h-px w-8 bg-gold/70" />
      <span className="text-gold text-[11px] tracking-[0.32em] uppercase font-bold">{children}</span>
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-1.5 md:gap-2 mb-8 overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = idx === current;
        const done = idx < current;
        return (
          <div key={s} className="flex items-center gap-1.5 md:gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                  done
                    ? "bg-gold border-gold text-black"
                    : active
                      ? "border-gold text-gold"
                      : "border-[#2E2E2E] text-[#5C5C5C]"
                }`}
              >
                {done ? <Check size={13} strokeWidth={3} /> : idx}
              </div>
              <span
                className={`text-[12px] font-medium hidden lg:inline ${
                  active ? "text-white" : done ? "text-mist" : "text-[#5C5C5C]"
                }`}
              >
                {s}
              </span>
            </div>
            {idx < steps.length && (
              <div className={`h-px w-4 md:w-7 shrink-0 ${done ? "bg-gold" : "bg-line"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
