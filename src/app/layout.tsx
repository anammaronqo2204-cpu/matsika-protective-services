import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.name} — Guarding, Armed Response & Off-Site Monitoring`,
    template: `%s | ${COMPANY.name}`,
  },
  description:
    "PSiRA-registered security services across South Africa: manned guarding, armed response, CCTV and off-site monitoring, access control, VIP protection and specialised operations. 24/7 national control room.",
  keywords: [
    "security company South Africa",
    "PSiRA registered security",
    "armed response",
    "manned guarding",
    "CCTV monitoring",
    "security officer jobs",
  ],
  openGraph: {
    title: `${COMPANY.name} — ${COMPANY.tagline}`,
    description:
      "Manned guarding, armed response, off-site CCTV monitoring and specialised security operations backed by a 24/7 national control room.",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
