/**
 * Backdrop
 * Pure CSS + SVG decorative backdrop used in place of stock photography.
 * Renders our own crest motif so no third-party people, uniforms or
 * branding ever appear on the site.
 */
export default function Backdrop({
  variant = "crest",
  className = "",
}: {
  variant?: "crest" | "steel" | "radar";
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Base */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Gold wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === "radar"
              ? "radial-gradient(70% 90% at 78% 45%, rgba(201,162,39,0.20) 0%, transparent 62%)"
              : "radial-gradient(85% 100% at 82% 22%, rgba(201,162,39,0.17) 0%, transparent 60%)",
        }}
      />

      {/* Structural lines */}
      <div className="absolute inset-0 grid-lines opacity-45" />

      {/* Diagonal brushed streaks */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0px, transparent 46px, rgba(201,162,39,0.055) 46px, rgba(201,162,39,0.055) 47px)",
        }}
      />

      {variant === "radar" && (
        <svg
          className="absolute right-[-6%] top-1/2 -translate-y-1/2 h-[150%] opacity-25"
          viewBox="0 0 400 400"
          fill="none"
        >
          {[60, 110, 160, 195].map((r) => (
            <circle key={r} cx="200" cy="200" r={r} stroke="#C9A227" strokeWidth="0.8" opacity="0.5" />
          ))}
          <line x1="200" y1="5" x2="200" y2="395" stroke="#C9A227" strokeWidth="0.6" opacity="0.35" />
          <line x1="5" y1="200" x2="395" y2="200" stroke="#C9A227" strokeWidth="0.6" opacity="0.35" />
        </svg>
      )}

      {variant === "crest" && (
        <svg
          className="absolute right-[-4%] top-1/2 -translate-y-1/2 h-[170%] opacity-[0.14]"
          viewBox="0 0 200 220"
          fill="none"
        >
          {/* Shield outline */}
          <path
            d="M100 8 L178 40 V118 C178 168 140 198 100 212 C60 198 22 168 22 118 V40 Z"
            stroke="#C9A227"
            strokeWidth="1.6"
          />
          <path
            d="M100 22 L166 49 V117 C166 160 134 186 100 198 C66 186 34 160 34 117 V49 Z"
            stroke="#C9A227"
            strokeWidth="0.9"
            opacity="0.65"
          />
          {/* Wing strokes */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={0.55 - i * 0.09}>
              <path
                d={`M22 ${72 + i * 20} C -12 ${62 + i * 20}, -34 ${80 + i * 20}, -46 ${94 + i * 20}`}
                stroke="#C9A227"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d={`M178 ${72 + i * 20} C 212 ${62 + i * 20}, 234 ${80 + i * 20}, 246 ${94 + i * 20}`}
                stroke="#C9A227"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          ))}
          {/* Padlock */}
          <rect x="86" y="150" width="28" height="24" rx="3" stroke="#C9A227" strokeWidth="1.4" />
          <path d="M92 150 V142 A8 8 0 0 1 108 142 V150" stroke="#C9A227" strokeWidth="1.4" />
        </svg>
      )}

      {/* Bottom fade into page */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/35" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black to-transparent" />
    </div>
  );
}
