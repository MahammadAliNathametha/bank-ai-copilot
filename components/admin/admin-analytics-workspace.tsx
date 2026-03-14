"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { AccountRecord, AdminMetricRecord, TransactionRecord } from "@/lib/data/mock-bank-store";

export function AdminAnalyticsWorkspace() {
  const { data: metrics } = useSuspenseQuery({
    queryKey: ["admin-metrics", "analytics"],
    queryFn: () => apiRequest<AdminMetricRecord[]>("/api/admin")
  });
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "analytics"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });
  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "analytics"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const transactionVolume = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  return (
    <SectionShell
      eyebrow="Admin"
      title="Behavioral analytics for the current tenant portfolio"
      description="This view blends admin metrics with live account and transaction activity to give the placeholder analytics page a real operating picture."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Deposit base" value={formatCurrency(totalBalance)} note="Aggregate live balance exposure." />
        <MetricCard label="Volume" value={formatCurrency(transactionVolume)} note="Absolute transaction movement." />
        <MetricCard label="Signals" value={String(metrics.length)} note="Tracked admin metric rows." />
        <MetricCard label="Accounts" value={String(accounts.length)} note="Visible account footprint." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Adoption pulse</h2>
          {metrics.map((metric) => (
            <div key={metric.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{metric.label}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{metric.category}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Current value: {metric.value}</p>
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Operator readout</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>The live balance base shows how much customer liquidity is sitting in the current tenant accounts.</li>
            <li>Transaction volume gives a practical adoption proxy before event funnels and cohort tables are added.</li>
            <li>The seeded admin metrics already provide enough structure to replace the analytics placeholder with a real monitoring surface.</li>
          </ul>
        </Card>
      </div>
    </SectionShell>
  );
}
