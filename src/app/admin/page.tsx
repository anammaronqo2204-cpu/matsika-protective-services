"use client";

import AdminShell from "@/components/admin/admin-shell";
import Dashboard from "@/components/admin/dashboard";

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Recruitment Dashboard" subtitle="Overview of the Matsika officer talent pool">
      <Dashboard />
    </AdminShell>
  );
}
