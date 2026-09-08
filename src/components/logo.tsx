export default function Logo({
  size = 74,
  showText = true,
  className = "",
}: {
  size?: number;
  showText?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="Matsika Protective Services"
        style={{
          width: showText ? size * 1.55 : size,
          height: size,
          objectFit: "contain",
          objectPosition: "center",
        }}
      />
    </span>
  );
}
