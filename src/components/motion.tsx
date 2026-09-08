"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/* Thin gold progress line showing how far down the page the visitor has scrolled. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? (el.scrollTop / max) * 100 : 0;
      if (ref.current) ref.current.style.width = `${pct}%`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div ref={ref} id="scroll-progress" aria-hidden="true" />;
}

/* Appears after scrolling down; returns the visitor smoothly to the top. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`back-top ${show ? "back-top-show" : ""}`}
    >
      <ArrowUp size={16} />
    </button>
  );
}

/* Card wrapper: a soft gold glow follows the visitor's mouse across the card. */
export function Spotlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight ${className}`}>
      <span className="spotlight-glow" aria-hidden="true" />
      {children}
    </div>
  );
}

/* Hero photograph with slow drift plus subtle scroll and mouse parallax. */
export function HeroMedia({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 18;
      my = (e.clientY / window.innerHeight - 0.5) * 12;
    };
    const tick = () => {
      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      const sy = Math.min(window.scrollY * 0.18, 160);
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${(cy + sy).toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div ref={ref} className="absolute -inset-[5%] will-change-transform">
      <img src={src} alt={alt} className="hero-drift h-full w-full object-cover" />
    </div>
  );
}
