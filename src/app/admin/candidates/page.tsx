"use client";

import AdminShell from "@/components/admin/admin-shell";
import CandidateList from "@/components/admin/candidate-list";

export default function AdminCandidatesPage() {
  return (
    <AdminShell title="Candidates" subtitle="Search, filter and manage the talent pool">
      <CandidateList />
    </AdminShell>
  );
}
