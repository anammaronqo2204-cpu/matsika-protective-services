import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Matsika Protective Services | Professional Security Solutions",
    template: "%s | Matsika Protective Services",
  },
  description:
    "Professional security services for commercial properties, industrial facilities, residential estates and events in South Africa.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink font-sans text-cream antialiased">{children}</body>
    </html>
  );
}
