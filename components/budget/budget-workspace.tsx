"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { InsightRecord, TransactionRecord } from "@/lib/data/mock-bank-store";

type InsightsPayload = {
  healthScore: number;
  savingsRate: number;
  totalBalance: number;
  monthlySpend: number;
  insights: InsightRecord[];
};

const monthlyBudgetTarget = 750;

export function BudgetWorkspace() {
  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "budget"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });
  const { data: insights } = useSuspenseQuery({
    queryKey: ["insights", "budget"],
    queryFn: () => apiRequest<InsightsPayload>("/api/insights")
  });

  const spendByCategory = Object.entries(
    transactions.reduce<Record<string, number>>((accumulator, transaction) => {
      if (transaction.amount >= 0) {
        return accumulator;
      }

      accumulator[transaction.category] = (accumulator[transaction.category] ?? 0) + Math.abs(transaction.amount);
      return accumulator;
    }, {})
  ).sort((left, right) => right[1] - left[1]);

  const spent = insights.monthlySpend;
  const remaining = Math.max(0, monthlyBudgetTarget - spent);

  return (
    <SectionShell
      eyebrow="Budget"
      title="Category budgeting and spend pacing on the live tenant ledger"
      description="This page replaces the shell with a practical budget view built from live transaction categories and the existing insights summary."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Budget target" value={formatCurrency(monthlyBudgetTarget)} note="Current monthly spending envelope." />
        <MetricCard label="Spent" value={formatCurrency(spent)} note="Outgoing movement from the live transaction feed." />
        <MetricCard label="Remaining" value={formatCurrency(remaining)} note="Available room before the current budget is exhausted." />
        <MetricCard label="Categories" value={String(spendByCategory.length)} note="Tracked spend buckets in the current activity set." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Category budgets</h2>
          {spendByCategory.map(([category, amount]) => {
            const share = monthlyBudgetTarget > 0 ? Math.min(100, (amount / monthlyBudgetTarget) * 100) : 0;

            return (
              <div key={category} className="space-y-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{category}</p>
                  <span className="text-sm font-semibold text-slate-300">{formatCurrency(amount)}</span>
                </div>
                <div className="overflow-hidden rounded-full bg-[#0a0a0a]">
                  <div className="h-3 rounded-full bg-primary" style={{ width: `${Math.max(10, share)}%` }} />
                </div>
              </div>
            );
          })}
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Budget coaching</h2>
          <p className="text-sm text-slate-400">
            {insights.insights[0]?.summary ?? "No coaching insight available yet."}
          </p>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>The current monthly spend is already available through the live insights API, so this page can show real pacing without a new budget table.</li>
            <li>Food and utility categories are the clearest early budget controls in the seeded ledger.</li>
            <li>A future budgeting backend can layer saved targets and alerts onto this same page structure.</li>
          </ul>
        </Card>
      </div>
    </SectionShell>
  );
}
