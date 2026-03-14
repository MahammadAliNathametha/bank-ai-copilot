"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { apiRequest } from "@/lib/services/http";
import type { AdminMetricRecord } from "@/lib/data/mock-bank-store";

export function AdminMetricsWorkspace() {
  const { data: metrics } = useSuspenseQuery({
    queryKey: ["admin-metrics"],
    queryFn: () => apiRequest<AdminMetricRecord[]>("/api/admin")
  });

  const mau = metrics.find((metric) => metric.label === "MAU")?.value ?? 0;
  const churn = metrics.find((metric) => metric.label === "Churn")?.value ?? 0;

  return (
    <SectionShell
      eyebrow="Metrics"
      title="SaaS operations metrics pulled from the live admin dataset"
      description="This page replaces the shell with a live overview of tenant metrics already backed by the admin API."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Metrics" value={String(metrics.length)} note="Rows available in the admin feed." />
        <MetricCard label="MAU" value={String(mau)} note="Monthly active users in the seeded portfolio." />
        <MetricCard label="Churn" value={`${churn}%`} note="Current tenant portfolio churn." />
        <MetricCard label="Categories" value={String(new Set(metrics.map((metric) => metric.category)).size)} note="Distinct metric groups tracked." />
      </div>
      <Card className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin ledger</p>
          <h2 className="mt-2 font-display text-3xl">Operational metrics</h2>
        </div>
        <Table
          headers={["Category", "Label", "Value", "Recorded"]}
          rows={metrics.map((metric) => [
            metric.category,
            metric.label,
            String(metric.value),
            metric.createdAt
          ])}
        />
      </Card>
    </SectionShell>
  );
}
