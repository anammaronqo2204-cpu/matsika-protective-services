"use client";

import AdminShell from "@/components/admin/admin-shell";
import MessagesInbox from "@/components/admin/messages-inbox";

export default function AdminMessagesPage() {
  return (
    <AdminShell title="Client Enquiries" subtitle="Quotes and enquiries received from the website">
      <MessagesInbox />
    </AdminShell>
  );
}
