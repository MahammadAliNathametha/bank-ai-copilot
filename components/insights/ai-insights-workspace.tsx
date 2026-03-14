"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import type { InsightRecord, TransactionRecord } from "@/lib/data/mock-bank-store";

type InsightsPayload = {
  healthScore: number;
  savingsRate: number;
  totalBalance: number;
  monthlySpend: number;
  insights: InsightRecord[];
};

export function AiInsightsWorkspace() {
  const { data: insights } = useSuspenseQuery({
    queryKey: ["insights", "ai"],
    queryFn: () => apiRequest<InsightsPayload>("/api/insights")
  });
  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "ai"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });

  const topCategory = Object.entries(
    transactions.reduce<Record<string, number>>((accumulator, transaction) => {
      if (transaction.amount >= 0) {
        return accumulator;
      }

      accumulator[transaction.category] = (accumulator[transaction.category] ?? 0) + Math.abs(transaction.amount);
      return accumulator;
    }, {})
  ).sort((left, right) => right[1] - left[1])[0];

  return (
    <SectionShell
      eyebrow="AI"
      title="Behavior-based insights generated from the live tenant ledger"
      description="This workspace turns the AI insights shell into a focused recommendation surface using the current insight feed and transaction profile."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Health score" value={String(insights.healthScore)} note="Primary wellbeing signal." />
        <MetricCard label="Savings rate" value={`${Math.round(insights.savingsRate * 100)}%`} note="Retention metric used for recommendations." />
        <MetricCard label="Top category" value={topCategory?.[0] ?? "N/A"} note="Largest spend cluster in the current ledger." />
        <MetricCard label="Insight count" value={String(insights.insights.length)} note="Live advisory cards available." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Recommendation stream</h2>
          {insights.insights.map((insight) => (
            <div key={insight.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{insight.title}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{insight.score}/100</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{insight.summary}</p>
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Model notes</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>The current signal mix is driven by spend concentration, total retained balance, and the seeded tenant insight records.</li>
            <li>Food-heavy spend currently dominates the category profile, which makes it the clearest coaching opportunity.</li>
            <li>This page is ready for a future server-side model without needing a route or UI rewrite.</li>
          </ul>
        </Card>
      </div>
    </SectionShell>
  );
}
