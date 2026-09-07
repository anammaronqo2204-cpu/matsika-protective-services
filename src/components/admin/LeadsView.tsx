"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Loader2, Mail, MapPin, Phone, Siren } from "lucide-react";
import { Badge, Card, Select } from "@/components/ui";
import { LEAD_STATUSES, LEAD_STATUS_COLORS, ROLES } from "@/lib/constants";
import { fmtDateTime } from "@/lib/format";
import type { LeadRow } from "@/lib/types";

const URGENCY_COLORS: Record<string, string> = {
  Standard: "#7A7A7A",
  Urgent: "#C4703D",
  Emergency: "#B5453F",
};

export default function LeadsView({ role }: { role: string }) {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/leads");
    const json = (await res.json()) as { ok: boolean; leads?: LeadRow[] };
    if (json.ok) setLeads(json.leads ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const update = async (id: number, status: string) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  const canEdit = role !== ROLES.VIEWER;
  const visible = filter ? leads.filter((l) => l.status === filter) : leads;

  return (
    <div className="p-5 md:p-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-white text-[26px]">Client Enquiries</h1>
          <p className="text-mute text-[13px] mt-1">
            Quote requests and site survey bookings captured from the website.
          </p>
        </div>
        <div className="w-56">
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </div>
      </div>

      {loading && (
        <div className="py-20 grid place-items-center">
          <Loader2 size={20} className="animate-spin text-gold" />
        </div>
      )}

      <div className="space-y-3">
        {visible.map((l) => (
          <Card key={l.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-gold">{l.reference}</span>
                  <Badge color={URGENCY_COLORS[l.urgency] ?? "#7A7A7A"}>{l.urgency}</Badge>
                  {l.urgency === "Emergency" && <Siren size={13} className="text-[#B5453F]" />}
                  <span className="text-[11px] text-mute">{fmtDateTime(l.createdAt)}</span>
                </div>
                <h2 className="text-white font-semibold text-[16px] mt-2">
                  {l.name}
                  {l.company && <span className="text-mute font-normal"> · {l.company}</span>}
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2.5 text-[12.5px] text-mist">
                  <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 hover:text-gold">
                    <Mail size={12} className="text-gold/70" /> {l.email}
                  </a>
                  <a href={`tel:${l.phone}`} className="inline-flex items-center gap-1.5 hover:text-gold">
                    <Phone size={12} className="text-gold/70" /> {l.phone}
                  </a>
                  {l.province && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} className="text-gold/70" /> {l.province}
                    </span>
                  )}
                  {l.sector && (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 size={12} className="text-gold/70" /> {l.sector}
                    </span>
                  )}
                </div>
                {l.service && (
                  <p className="text-[12.5px] text-gold-soft mt-2.5">Service: {l.service}</p>
                )}
                {l.siteAddress && (
                  <p className="text-[12.5px] text-mute mt-1">Site: {l.siteAddress}</p>
                )}
                {l.message && (
                  <p className="text-[13px] text-zinc-300 leading-relaxed mt-3 bg-[#0A0A0C] border border-line rounded-lg p-3">
                    {l.message}
                  </p>
                )}
              </div>

              <div className="shrink-0 w-full lg:w-48">
                <p className="text-[10px] uppercase tracking-[0.14em] text-mute mb-1.5">Status</p>
                {canEdit ? (
                  <Select value={l.status} onChange={(e) => void update(l.id, e.target.value)}>
                    {LEAD_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </Select>
                ) : (
                  <Badge color={LEAD_STATUS_COLORS[l.status]}>{l.status}</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
        {!loading && visible.length === 0 && (
          <Card className="p-12 text-center text-mute text-[13px]">
            No enquiries match this filter.
          </Card>
        )}
      </div>
    </div>
  );
}
