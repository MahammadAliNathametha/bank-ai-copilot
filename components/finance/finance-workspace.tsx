"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { AccountRecord, InsightRecord, TransactionRecord } from "@/lib/data/mock-bank-store";

type InsightsPayload = {
  healthScore: number;
  savingsRate: number;
  totalBalance: number;
  monthlySpend: number;
  insights: InsightRecord[];
};

export function FinanceWorkspace() {
  useSupabaseRealtime(["accounts", "transactions", "insights"]);

  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "finance"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });
  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "finance"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });
  const { data: insights } = useSuspenseQuery({
    queryKey: ["insights", "finance"],
    queryFn: () => apiRequest<InsightsPayload>("/api/insights")
  });

  const topOutflows = transactions
    .filter((transaction) => transaction.amount < 0)
    .sort((left, right) => Math.abs(right.amount) - Math.abs(left.amount))
    .slice(0, 4);
  const liquidAccounts = accounts.filter((account) => account.type === "checking" || account.type === "savings");

  return (
    <SectionShell
      eyebrow="Finance"
      title="A personal finance control room grounded in live balances, spend, and insight data"
      description="This page replaces the shell with a practical financial summary built from the current accounts, transactions, and insights APIs."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total balance" value={formatCurrency(insights.totalBalance)} note="Aggregate balance across visible accounts." />
        <MetricCard label="Monthly spend" value={formatCurrency(insights.monthlySpend)} note="Current outgoing activity." />
        <MetricCard label="Savings rate" value={`${Math.round(insights.savingsRate * 100)}%`} note="Retention pace from the insights engine." />
        <MetricCard label="Health score" value={String(insights.healthScore)} note="Overall behavior-derived financial signal." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Top outflows</h2>
          {topOutflows.map((transaction) => (
            <div key={transaction.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{transaction.description}</p>
                <span className="text-sm font-semibold text-slate-300">{formatCurrency(transaction.amount)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{transaction.category} · {transaction.date}</p>
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Portfolio posture</h2>
          {liquidAccounts.map((account) => (
            <div key={account.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{account.name}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{account.type}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{formatCurrency(account.balance)} available in this product.</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
