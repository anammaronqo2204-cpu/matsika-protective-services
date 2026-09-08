"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Loader2, LogOut, MessagesSquare, Users } from "lucide-react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui";
import LoginForm from "./login-form";

export interface AdminSession {
  username: string;
  name: string;
  role: string;
}

export function useAdminSession() {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/session")
      .then(async (r) => {
        if (r.ok) {
          const data = await r.json();
          if (mounted) setAdmin(data);
        }
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return { admin, loading };
}

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/candidates", label: "Candidates", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessagesSquare },
];

export default function AdminShell({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { admin, loading } = useAdminSession();
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Loader2 size={22} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-16">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ink">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-coal md:flex">
        <div className="border-b border-line px-5 py-5">
          <Link href="/">
            <Logo size={34} />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  active
                    ? "border border-gold/30 bg-gold/12 text-gold-pale"
                    : "text-dim hover:bg-white/5 hover:text-[#D6D6D6]"
                }`}
              >
                <n.icon size={16} /> {n.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-dim transition-colors hover:bg-white/5 hover:text-[#D6D6D6]"
          >
            <LayoutDashboard size={16} /> View Public Site
          </Link>
        </nav>
        <div className="border-t border-line px-5 py-4">
          <div className="text-[12.5px] font-semibold text-gold-pale">{admin.name}</div>
          <div className="mb-3 text-[10.5px] text-dim">{admin.role}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start !px-2" onClick={logout}>
            <LogOut size={13} /> Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-line bg-coal px-4 py-3 md:hidden">
          <Link href="/">
            <Logo size={28} />
          </Link>
          <div className="flex items-center gap-1.5">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg p-2 ${
                  pathname === n.href ? "bg-gold/15 text-gold" : "text-dim"
                }`}
              >
                <n.icon size={16} />
              </Link>
            ))}
            <button onClick={logout} className="p-2 text-dim">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {(title || subtitle) && (
          <div className="border-b border-line bg-panel px-6 py-5 md:px-8">
            <h1 className="font-display text-[24px] font-semibold text-cream">{title}</h1>
            {subtitle && <p className="mt-0.5 text-[13px] text-dim">{subtitle}</p>}
          </div>
        )}

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
