"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { AccountRecord, InsightRecord, InvestmentAccountRecord, OpenConnectionRecord } from "@/lib/data/mock-bank-store";

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
  const { data: insights } = useSuspenseQuery({
    queryKey: ["insights", "invest"],
    queryFn: () => apiRequest<InsightsPayload>("/api/insights")
  });
  const { data: investmentAccounts } = useSuspenseQuery({
    queryKey: ["investments"],
    queryFn: () => apiRequest<InvestmentAccountRecord[]>("/api/investments")
  });
  const { data: connections } = useSuspenseQuery({
    queryKey: ["open-connections"],
    queryFn: () => apiRequest<OpenConnectionRecord[]>("/api/open")
  });

  const investableBalance = accounts.reduce((sum, account) => sum + account.balance, 0) * 0.18;
  const externalBalance = investmentAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <SectionShell
      eyebrow="Invest"
      title="Investment planning signals derived from live balance and cashflow data"
      description="This workspace uses current account balances, inflows, and insight cues to replace the investment shell with a practical planning view."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Investable cash" value={formatCurrency(investableBalance)} note="A simple planning slice of current deposits." />
        <MetricCard label="External balance" value={formatCurrency(externalBalance)} note="Connected investment holdings." />
        <MetricCard label="Open connections" value={String(connections.length)} note="Active aggregation links." />
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
          <h2 className="font-display text-3xl">Connected portfolios</h2>
          <div className="rounded-3xl bg-white/10 px-6 py-6 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Outlook</p>
            <p className="mt-2 font-display text-5xl">{formatCurrency(investableBalance)}</p>
            <p className="mt-3 text-sm text-white/80">{insights.insights[0]?.summary ?? "No insight available yet."}</p>
          </div>
          <div className="space-y-3">
            {investmentAccounts.map((account) => (
              <div key={account.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{account.accountName}</p>
                  <span className="text-xs text-slate-400">{account.provider}</span>
                </div>
                <p className="text-sm text-slate-400">{formatCurrency(account.balance)} · {account.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
