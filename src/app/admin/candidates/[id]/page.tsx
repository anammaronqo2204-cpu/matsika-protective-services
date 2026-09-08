"use client";

import AdminShell from "@/components/admin/admin-shell";
import CandidateProfile from "@/components/admin/candidate-profile";

export default function AdminCandidateDetailPage() {
  return (
    <AdminShell title="Candidate Profile" subtitle="Full record, documents and recruitment workflow">
      <CandidateProfile />
    </AdminShell>
  );
}
