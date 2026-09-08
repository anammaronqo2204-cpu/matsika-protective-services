"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import LoginForm from "@/components/admin/login-form";

export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/session")
      .then(async (r) => {
        if (r.ok) router.replace("/admin");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Loader2 size={22} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-16">
      <LoginForm />
    </div>
  );
}
