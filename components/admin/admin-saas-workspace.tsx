"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { AccountRecord, AdminMetricRecord, UserProfile } from "@/lib/data/mock-bank-store";
import type { MigrationStatus } from "@/lib/services/migrations";

export function AdminSaasWorkspace() {
  const { data: metrics } = useSuspenseQuery({
    queryKey: ["admin-metrics", "saas"],
    queryFn: () => apiRequest<AdminMetricRecord[]>("/api/admin")
  });
  const { data: users } = useSuspenseQuery({
    queryKey: ["users", "saas"],
    queryFn: () => apiRequest<UserProfile[]>("/api/users")
  });
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "saas"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });
  const { data: migrationStatus } = useSuspenseQuery({
    queryKey: ["admin-migrate-status"],
    queryFn: () => apiRequest<MigrationStatus & { action: string }>("/api/admin/migrate")
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const estimatedMrr = users.length * 12 + metrics.length * 35;

  return (
    <SectionShell
      eyebrow="SaaS"
      title="Tenant monetization and portfolio economics on the live operating dataset"
      description="This page replaces the SaaS shell with a practical monetization overview using current admin metrics, user counts, and balance exposure."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Estimated MRR" value={formatCurrency(estimatedMrr)} note="Simple pricing signal from current tenant footprint." />
        <MetricCard label="Users" value={String(users.length)} note="Profiles contributing to adoption." />
        <MetricCard label="Metrics" value={String(metrics.length)} note="Tracked SaaS operating signals." />
        <MetricCard label="Balance base" value={formatCurrency(totalBalance)} note="Portfolio scale currently managed." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Pricing signals</h2>
          {metrics.map((metric) => (
            <div key={metric.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{metric.label}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{metric.category}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Operational value: {metric.value}</p>
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Portfolio commentary</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>The current live user count is enough to model a lightweight per-seat pricing baseline.</li>
            <li>Admin metrics provide an early operational layer for adoption and retention pricing narratives.</li>
            <li>Account balances help frame the scale of the tenant portfolio being served.</li>
          </ul>
        </Card>
      </div>
      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Migration readiness</p>
            <h2 className="mt-2 font-display text-3xl">Supabase deployment status</h2>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              migrationStatus.ready ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {migrationStatus.ready ? "Ready" : "Needs config"}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Migration files" value={String(migrationStatus.migrationCount)} note="SQL files discovered in the repo." />
          <MetricCard label=".env.local" value={migrationStatus.envLocalPresent ? "Present" : "Missing"} note="Local environment file detection." />
          <MetricCard label="DATABASE_URL" value={migrationStatus.databaseUrlConfigured ? "Configured" : "Missing"} note="Direct migration transport availability." />
          <MetricCard label="Latest" value={migrationStatus.latestMigration ?? "None"} note="Newest repo migration file." />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
            <p className="text-sm font-semibold text-white">Required environment</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>NEXT_PUBLIC_SUPABASE_URL: {migrationStatus.requiredEnv.nextPublicSupabaseUrl ? "configured" : "missing"}</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {migrationStatus.requiredEnv.nextPublicSupabaseAnonKey ? "configured" : "missing"}</li>
              <li>SUPABASE_SERVICE_ROLE_KEY: {migrationStatus.requiredEnv.supabaseServiceRoleKey ? "configured" : "missing"}</li>
              <li>DEFAULT_TENANT_ID: {migrationStatus.requiredEnv.defaultTenantId ? "configured" : "missing"}</li>
              <li>DATABASE_URL: {migrationStatus.requiredEnv.databaseUrl ? "configured" : "missing"}</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
            <p className="text-sm font-semibold text-white">Repo migrations</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {migrationStatus.migrations.map((migration) => (
                <li key={migration}>{migration}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </SectionShell>
  );
}
