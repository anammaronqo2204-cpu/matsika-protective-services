import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink grid place-items-center px-6">
      <div className="absolute inset-0 grid-lines opacity-40 pointer-events-none" />
      <div className="relative text-center max-w-md">
        <Image
          src="/images/logo.png"
          alt="Matsika Protective Services"
          width={72}
          height={72}
          className="mx-auto rounded-sm"
        />
        <p className="text-gold text-[11px] tracking-[0.3em] uppercase font-bold mt-8">
          Error 404
        </p>
        <h1 className="font-display text-white text-[40px] leading-tight mt-3">
          This post is unmanned.
        </h1>
        <p className="text-mist text-[13.5px] leading-relaxed mt-4">
          The page you are looking for has moved or never existed. Our control room can point you in
          the right direction.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-linear-to-b from-[#E9C85A] to-[#C9A227] text-black text-[13px] font-bold uppercase tracking-[0.12em]"
          >
            Return Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gold/50 text-gold-soft text-[13px] font-semibold uppercase tracking-[0.12em] hover:bg-gold/10"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
