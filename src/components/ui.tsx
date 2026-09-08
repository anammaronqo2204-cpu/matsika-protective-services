"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { Check, ChevronDown } from "lucide-react";

/* ------------------------------- Button --------------------------------- */
type ButtonVariant = "primary" | "outline" | "ghost" | "dark" | "danger" | "white";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";
  const sizes: Record<string, string> = {
    sm: "px-3.5 py-1.5 text-[12px]",
    md: "px-5 py-2.5 text-[13px]",
    lg: "px-7 py-3.5 text-[14px]",
    xl: "px-9 py-4 text-[15px]",
  };
  const variants: Record<ButtonVariant, string> = {
    primary: "border border-gold bg-gold text-ink hover:border-gold-pale hover:bg-gold-pale",
    outline: "border border-gold/60 text-gold-pale hover:bg-gold/10 hover:border-gold",
    ghost: "text-mist hover:text-cream hover:bg-white/5",
    dark: "border border-line2 bg-panel text-gold-pale hover:border-gold/50",
    danger: "border border-danger/60 text-[#E3948F] hover:bg-danger/10",
    white: "bg-cream text-ink hover:bg-white",
  };
  return (
    <button {...props} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

/* -------------------------------- Card ---------------------------------- */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`border border-line bg-panel ${className}`}>{children}</div>
  );
}

/* -------------------------------- Badge --------------------------------- */
export function Badge({
  children,
  color = "#C9A227",
  tone = "solid",
  className = "",
}: {
  children: ReactNode;
  color?: string;
  tone?: "solid" | "soft";
  className?: string;
}) {
  if (tone === "solid") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold tracking-wide ${className}`}
        style={{ backgroundColor: color + "22", color, border: `1px solid ${color}55` }}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-white/5 text-mist ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------- Forms --------------------------------- */
export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-dim">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full border border-line2 bg-coal px-3.5 py-3 text-[14px] text-cream placeholder-faint outline-none transition-colors hover:border-dim focus:border-gold";

export function TextInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return <input {...props} className={`${inputCls} ${className}`} />;
}

export function TextArea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <textarea
      {...props}
      className={`${inputCls} min-h-[80px] resize-y ${className}`}
    />
  );
}

export function Select({
  children,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${inputCls} cursor-pointer appearance-none pr-9 ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dim"
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
    <label className="flex cursor-pointer select-none items-start gap-3">
      <span
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors ${
          checked ? "border-gold bg-gold" : "border-line2 bg-coal"
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} className="text-[#0A0A0A]" />}
      </span>
      <span className="text-[13px] leading-relaxed text-[#D6D6D6]">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
    </label>
  );
}

/* ------------------------------- Stepper -------------------------------- */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mb-8 flex items-center gap-1.5 overflow-x-auto pb-1 md:gap-2">
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = idx === current;
        const done = idx < current;
        return (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center border text-[11px] font-bold ${
                done
                  ? "border-gold bg-gold text-[#0A0A0A]"
                  : active
                    ? "border-gold text-gold"
                    : "border-line2 text-[#5C5C5C]"
              }`}
            >
              {done ? <Check size={13} strokeWidth={3} /> : idx}
            </span>
            <span
              className={`hidden text-[12px] font-medium md:inline ${
                active ? "text-cream" : done ? "text-mist" : "text-[#5C5C5C]"
              }`}
            >
              {s}
            </span>
            {idx < steps.length && (
              <span className={`h-px w-4 shrink-0 md:w-8 ${done ? "bg-gold" : "bg-line2"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------- Reveal --------------------------------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
