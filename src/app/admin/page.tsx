"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Briefcase,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/site/Header";
import Dashboard, { type Overview } from "@/components/admin/Dashboard";
import CandidatesView from "@/components/admin/CandidatesView";
import LeadsView from "@/components/admin/LeadsView";
import VacanciesView from "@/components/admin/VacanciesView";
import type { SessionInfo } from "@/lib/types";

const NAV: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "candidates", label: "Candidates", icon: Users },
  { key: "leads", label: "Enquiries", icon: Inbox },
  { key: "vacancies", label: "Vacancies", icon: Briefcase },
];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionInfo | null>(null);
  const [checking, setChecking] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((json: { ok: boolean; user: SessionInfo | null }) => {
        if (!active) return;
        if (!json.ok || !json.user) {
          router.replace("/admin/login");
        } else {
          setUser(json.user);
        }
        setChecking(false);
      })
      .catch(() => {
        if (active) {
          router.replace("/admin/login");
          setChecking(false);
        }
      });
    return () => {
      active = false;
    };
  }, [router]);

  const loadOverview = useCallback(async () => {
    const res = await fetch("/api/admin/overview");
    const json = (await res.json()) as { ok: boolean; overview?: Overview };
    if (json.ok && json.overview) setOverview(json.overview);
  }, []);

  useEffect(() => {
    if (user) void loadOverview();
  }, [user, loadOverview]);

  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
  };

  if (checking || !user) {
    return (
      <div className="min-h-screen bg-ink grid place-items-center">
        <Loader2 size={22} className="animate-spin text-gold" />
      </div>
    );
  }

  const goto = (key: string) => {
    setPage(key);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen flex bg-ink">
      <aside className="w-60 shrink-0 border-r border-line hidden md:flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-line">
          <Logo size={36} />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => goto(n.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                page === n.key
                  ? "bg-gold/12 text-gold-soft border border-gold/30"
                  : "text-mute hover:bg-white/5 hover:text-zinc-300"
              }`}
            >
              <n.icon size={16} /> {n.label}
            </button>
          ))}
          <Link
            href="/"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-mute hover:bg-white/5 hover:text-zinc-300"
          >
            <ExternalLink size={15} /> View website
          </Link>
        </nav>
        <div className="px-5 py-4 border-t border-line">
          <div className="text-[12.5px] text-gold-soft font-semibold">{user.name}</div>
          <div className="text-[10.5px] text-mute mb-3">{user.role}</div>
          <button
            onClick={() => void logout()}
            className="inline-flex items-center gap-2 text-[12px] text-mute hover:text-white"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-line sticky top-0 bg-black/90 backdrop-blur z-30">
          <Logo size={30} />
          <div className="flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => goto(n.key)}
                className={`p-2 rounded-lg ${
                  page === n.key ? "bg-gold/15 text-gold" : "text-mute"
                }`}
                aria-label={n.label}
              >
                <n.icon size={16} />
              </button>
            ))}
            <button onClick={() => void logout()} className="p-2 text-mute" aria-label="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1">
          {page === "dashboard" &&
            (overview ? (
              <Dashboard
                overview={overview}
                onOpenCandidate={(id) => {
                  setPage("candidates");
                  setSelectedId(id);
                }}
                onGoto={goto}
              />
            ) : (
              <div className="min-h-[60vh] grid place-items-center">
                <Loader2 size={20} className="animate-spin text-gold" />
              </div>
            ))}
          {page === "candidates" && (
            <CandidatesView
              role={user.role}
              selectedId={selectedId}
              setSelectedId={(id) => {
                setSelectedId(id);
                if (!id) void loadOverview();
              }}
            />
          )}
          {page === "leads" && <LeadsView role={user.role} />}
          {page === "vacancies" && <VacanciesView role={user.role} />}
        </div>
      </div>
    </div>
  );
}
