import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * The staff portal is intentionally unlinked from the public website.
 * It is reachable only by typing /admin directly, and is excluded from
 * search engines, sitemaps and AI/link previews.
 */
export const metadata: Metadata = {
  title: "Staff Portal",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
