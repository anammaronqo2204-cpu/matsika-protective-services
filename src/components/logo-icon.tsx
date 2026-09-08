export default function LogoIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Matsika Protective Services"
      className={`drop-shadow-[0_0_22px_rgba(201,162,39,0.4)] ${className}`}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
