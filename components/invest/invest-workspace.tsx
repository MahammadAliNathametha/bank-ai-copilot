"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
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

export function InvestWorkspace() {
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "invest"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });
  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "invest"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });
  const { data: insights } = useSuspenseQuery({
    queryKey: ["insights", "invest"],
    queryFn: () => apiRequest<InsightsPayload>("/api/insights")
  });

  const investableBalance = accounts.reduce((sum, account) => sum + account.balance, 0) * 0.18;
  const inflows = transactions.filter((transaction) => transaction.amount > 0).reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <SectionShell
      eyebrow="Invest"
      title="Investment planning signals derived from live balance and cashflow data"
      description="This workspace uses current account balances, inflows, and insight cues to replace the investment shell with a practical planning view."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Investable cash" value={formatCurrency(investableBalance)} note="A simple planning slice of current deposits." />
        <MetricCard label="Recent inflows" value={formatCurrency(inflows)} note="Positive ledger movement available for allocation." />
        <MetricCard label="Health score" value={String(insights.healthScore)} note="Planning confidence based on current behavior." />
        <MetricCard label="Savings rate" value={`${Math.round(insights.savingsRate * 100)}%`} note="Retention pace before investing." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Allocation ideas</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>Reserve a cash buffer from savings before shifting capital into longer-term investments.</li>
            <li>Use recurring inflows as the basis for dollar-cost averaging once brokerage rails exist.</li>
            <li>The live insight feed already provides behavioral context to support next-best-action prompts.</li>
          </ul>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Current planning signal</h2>
          <div className="rounded-3xl bg-white/10 px-6 py-6 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Outlook</p>
            <p className="mt-2 font-display text-5xl">{formatCurrency(investableBalance)}</p>
            <p className="mt-3 text-sm text-white/80">{insights.insights[0]?.summary ?? "No insight available yet."}</p>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
