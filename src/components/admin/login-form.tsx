"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Info, Loader2, Lock } from "lucide-react";
import Logo from "@/components/logo";
import { Button, Card, Field, TextInput } from "@/components/ui";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid username or password.");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Invalid username or password.");
      setBusy(false);
    }
  };

  return (
    <Card className="w-full max-w-sm p-7">
      <div className="mb-5 flex justify-center">
        <Logo size={44} showText={false} />
      </div>
      <h1 className="text-center font-display text-[22px] font-semibold text-cream">
        Administrator Sign In
      </h1>
      <p className="mb-6 mt-1 text-center text-[12.5px] text-dim">
        Authorised Matsika recruitment staff only.
      </p>
      <form onSubmit={submit}>
        <Field label="Username" required>
          <TextInput value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dim"
              aria-label="Toggle password visibility"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        {err && (
          <p className="mb-3 flex items-center gap-1.5 text-[12.5px] text-[#E3948F]">
            <AlertCircle size={13} /> {err}
          </p>
        )}
        <Button type="submit" className="mt-1 w-full" disabled={busy}>
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
          {busy ? "Signing in…" : "Sign In"}
        </Button>
      </form>
      <div className="mt-6 rounded-lg border border-line2 bg-coal p-3.5 text-[11px] leading-relaxed text-dim">
        <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-gold">
          <Info size={11} /> Demo credentials
        </div>
        <div className="space-y-0.5 font-mono text-[10.5px]">
          <div>admin / MatsikaAdmin#2026 — Super Admin</div>
          <div>recruiter / Recruiter#2026 — Recruitment Admin</div>
          <div>docs / DocsReview#2026 — Document Officer</div>
          <div>viewer / ReadOnly#2026 — Read Only</div>
        </div>
      </div>
    </Card>
  );
}
