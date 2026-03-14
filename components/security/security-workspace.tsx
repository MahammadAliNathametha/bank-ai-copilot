"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import type { AuthSessionRecord, CardRecord, NotificationRecord } from "@/lib/data/mock-bank-store";

export function SecurityWorkspace() {
  const { data: session } = useSuspenseQuery({
    queryKey: ["auth-session"],
    queryFn: () => apiRequest<AuthSessionRecord>("/api/auth")
  });

  const { data: cards } = useSuspenseQuery({
    queryKey: ["cards"],
    queryFn: () => apiRequest<CardRecord[]>("/api/cards")
  });

  const { data: notifications } = useSuspenseQuery({
    queryKey: ["notifications"],
    queryFn: () => apiRequest<NotificationRecord[]>("/api/notifications")
  });

  const alertsEnabled = notifications.filter((notification) => notification.status === "active").length;

  return (
    <SectionShell
      eyebrow="Security"
      title="Security posture, session confidence, and alert coverage"
      description="This page turns auth, card, and notification APIs into a tenant-branded trust center."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Session" value={session.status} note={`Current user ${session.email}`} />
        <MetricCard label="Cards protected" value={String(cards.length)} note="Card-level controls are visible here." />
        <MetricCard label="Alerts active" value={String(alertsEnabled)} note="Notification rules feeding the tenant security posture." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Security scorecard</h2>
          <div className="rounded-3xl bg-white/10 px-6 py-6 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Security health</p>
            <p className="mt-2 font-display text-6xl">92</p>
            <p className="mt-3 text-sm text-white/80">Mock score driven by active session, enabled alerts, and card protection controls.</p>
          </div>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>Biometric login is modeled as enabled for this tenant.</li>
            <li>Fraud notifications are routed through the same tenant-safe alerts pipeline.</li>
            <li>Audit logging remains the next live Supabase integration step.</li>
          </ul>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Card controls</h2>
          {cards.map((card) => (
            <div key={card.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">Card ending in {card.last4}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{card.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Alerts {card.alertsEnabled ? "enabled" : "disabled"} for this card under tenant-specific policy controls.
              </p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
