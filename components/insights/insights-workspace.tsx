"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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

const palette = ["hsl(var(--primary))", "#0f172a", "#1d4ed8", "#f97316", "#14b8a6"];

import { CarbonImpact } from "./carbon-impact";

export function InsightsWorkspace() {
  const { data: insights } = useSuspenseQuery({
    queryKey: ["insights"],
    queryFn: () => apiRequest<InsightsPayload>("/api/insights")
  });

  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "insights"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });

  const chartData = Object.values(
    transactions.reduce<Record<string, { name: string; value: number }>>((accumulator, transaction) => {
      if (transaction.amount >= 0) {
        return accumulator;
      }

      const key = transaction.category;
      accumulator[key] = accumulator[key] ?? { name: key, value: 0 };
      accumulator[key].value += Math.abs(transaction.amount);
      return accumulator;
    }, {})
  );

  return (
    <SectionShell
      eyebrow="Insights"
      title="AI-flavored financial context drawn from the tenant’s own data"
      description="Spending breakdowns, health scoring, savings nudges, and carbon-aware storytelling all reuse the existing insights and transactions APIs."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Health score" value={String(insights.healthScore)} note="Behavior-based wellbeing signal." />
        <MetricCard label="Savings rate" value={`${Math.round(insights.savingsRate * 100)}%`} note="Share of funds being retained." />
        <MetricCard label="Monthly spend" value={formatCurrency(insights.monthlySpend)} note="Outgoing transactions total." />
        <MetricCard label="Deposits" value={formatCurrency(insights.totalBalance)} note="Current aggregate balance." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="h-[420px] space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Spending composition</p>
            <h2 className="mt-2 font-display text-3xl">Category mix</h2>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={80} outerRadius={130} paddingAngle={4}>
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <div className="space-y-4">
          <Card className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Highlights</p>
            {insights.insights.map((insight) => (
              <div key={insight.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{insight.title}</h3>
                  <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{insight.score}/100</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{insight.summary}</p>
              </div>
            ))}
          </Card>
          <CarbonImpact />
        </div>
      </div>
    </SectionShell>
  );
}
