"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button, Card, Field, TextInput } from "@/components/ui";
import { Logo } from "@/components/site/Header";

const DEMO = [
  ["admin", "MatsikaAdmin#2026", "Super Administrator"],
  ["recruiter", "Recruiter#2026", "Recruitment Administrator"],
  ["docs", "DocsReview#2026", "Document Verification Officer"],
  ["viewer", "ReadOnly#2026", "Read Only"],
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) {
        setError(json.error ?? "Sign in failed.");
      } else {
        router.replace("/admin");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <div className="absolute inset-0 grid-lines opacity-40 pointer-events-none" />
      <div className="relative flex-1 grid place-items-center px-5 py-14">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-mute text-[12px] mb-6 hover:text-gold"
          >
            <ArrowLeft size={13} /> Back to website
          </Link>

          <Card className="p-7 panel-grad">
            <div className="flex justify-center mb-5">
              <Logo size={52} showText={false} />
            </div>
            <h1 className="font-display text-white text-[24px] text-center">Staff Portal</h1>
            <p className="text-mute text-[12.5px] text-center mt-1 mb-6">
              Authorised Matsika personnel only. All activity is logged.
            </p>

            <form onSubmit={submit}>
              <Field label="Username" required>
                <TextInput
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </Field>
              <Field label="Password" required>
                <div className="relative">
                  <TextInput
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-gold"
                    aria-label="Toggle password visibility"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>
              {error && (
                <p className="text-[#E3948F] text-[12.5px] mb-3 flex items-center gap-1.5">
                  <AlertCircle size={13} /> {error}
                </p>
              )}
              <Button type="submit" className="w-full mt-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    <Lock size={13} /> Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 bg-[#0A0A0C] border border-line rounded-lg p-3.5">
              <p className="text-[11px] text-gold font-bold uppercase tracking-[0.14em] mb-2">
                Demo credentials
              </p>
              <div className="space-y-1.5">
                {DEMO.map(([u, p, role]) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      setUsername(u);
                      setPassword(p);
                    }}
                    className="w-full text-left rounded px-2 py-1.5 hover:bg-white/5 transition-colors"
                  >
                    <span className="font-mono text-[10.5px] text-mist">
                      {u} / {p}
                    </span>
                    <span className="block text-[10px] text-mute">{role}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-mute mt-2">
                Click a row to auto-fill. Replace these accounts before go-live.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
