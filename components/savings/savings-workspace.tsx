"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { AccountRecord, InsightRecord, SavingsRuleRecord } from "@/lib/data/mock-bank-store";

type InsightsPayload = {
  healthScore: number;
  savingsRate: number;
  totalBalance: number;
  monthlySpend: number;
  insights: InsightRecord[];
};

import { SavingsLeaderboard } from "./leaderboard";
import { SavingsChallenges } from "./challenges";

export function SavingsWorkspace() {
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "savings"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });
  const { data: insights } = useSuspenseQuery({
    queryKey: ["insights", "savings"],
    queryFn: () => apiRequest<InsightsPayload>("/api/insights")
  });
  const { data: rules } = useSuspenseQuery({
    queryKey: ["savings-rules"],
    queryFn: () => apiRequest<SavingsRuleRecord[]>("/api/savings")
  });

  const savingsAccounts = accounts.filter((account) => account.type.toLowerCase().includes("savings"));
  const savingsBalance = savingsAccounts.reduce((sum, account) => sum + account.balance, 0);
  const goalTarget = 20000;
  const progress = Math.min(1, savingsBalance / goalTarget);

  return (
    <SectionShell
      eyebrow="Savings"
      title="Savings progress, retained balance, and goal momentum on live account data"
      description="This workspace uses existing account and insight endpoints to turn the savings shell into a real deposit-goal view."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Savings balance" value={formatCurrency(savingsBalance)} note="Funds currently held in savings products." />
        <MetricCard label="Savings rate" value={`${Math.round(insights.savingsRate * 100)}%`} note="Behavioral retention from the insights API." />
        <MetricCard label="Goal target" value={formatCurrency(goalTarget)} note="Current highlighted milestone." />
        <MetricCard label="Progress" value={`${Math.round(progress * 100)}%`} note="Distance to the current savings milestone." />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SavingsChallenges />
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-4">
            <h2 className="font-display text-3xl">Savings products</h2>
            {savingsAccounts.map((account) => (
                <div key={account.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">{account.name}</p>
                    <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{account.type}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{formatCurrency(account.balance)} currently allocated toward savings.</p>
                </div>
              ))}
          </Card>
          <Card className="space-y-4">
            <h2 className="font-display text-3xl">Automation rules</h2>
            {rules.map((rule) => (
              <div key={rule.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{rule.name}</p>
                  <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{rule.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{rule.cadence} · {formatCurrency(rule.amount)} toward {formatCurrency(rule.target)}</p>
              </div>
            ))}
            <div className="overflow-hidden rounded-full bg-white/10">
              <div className="h-4 rounded-full bg-primary" style={{ width: `${Math.max(8, progress * 100)}%` }} />
            </div>
              <p className="text-sm text-slate-400">
                {insights.insights[0]?.summary ?? "No insight available yet."}
              </p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>The current savings rate indicates how much of recent inflow is being retained.</li>
                <li>This page can evolve into round-ups and automated goals once those backend actions exist.</li>
              </ul>
            </Card>
          </div>
        </div>
        <div className="space-y-6">
          <SavingsLeaderboard />
        </div>ï¿½
      </div>
    </SectionShell>
  );
}
