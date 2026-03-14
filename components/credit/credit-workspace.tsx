"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { CardRecord, InsightRecord, LoanRecord } from "@/lib/data/mock-bank-store";

type InsightsPayload = {
  healthScore: number;
  savingsRate: number;
  totalBalance: number;
  monthlySpend: number;
  insights: InsightRecord[];
};

export function CreditWorkspace() {
  const { data: loans } = useSuspenseQuery({
    queryKey: ["loans", "credit"],
    queryFn: () => apiRequest<LoanRecord[]>("/api/loans")
  });
  const { data: cards } = useSuspenseQuery({
    queryKey: ["cards", "credit"],
    queryFn: () => apiRequest<CardRecord[]>("/api/cards")
  });
  const { data: insights } = useSuspenseQuery({
    queryKey: ["insights", "credit"],
    queryFn: () => apiRequest<InsightsPayload>("/api/insights")
  });

  const totalDebt = loans.reduce((sum, loan) => sum + loan.balance, 0);
  const activeCards = cards.filter((card) => card.status === "active").length;
  const derivedScore = Math.max(620, Math.min(820, 680 + Math.round(insights.healthScore / 2) - loans.length * 8 + activeCards * 5));

  return (
    <SectionShell
      eyebrow="Credit"
      title="Credit posture informed by live loans, cards, and financial health signals"
      description="This page turns the credit shell into a live-backed scorecard using the data already present in the tenant ledger."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Derived score" value={String(derivedScore)} note="A simple score proxy from current product state." />
        <MetricCard label="Loan exposure" value={formatCurrency(totalDebt)} note="Total outstanding balance across loans." />
        <MetricCard label="Active cards" value={String(activeCards)} note="Cards contributing to available revolving capacity." />
        <MetricCard label="Health score" value={String(insights.healthScore)} note="Financial behavior input from insights." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Key factors</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>Loan balances remain the largest drag on the current credit posture.</li>
            <li>Active cards and positive financial health improve the profile.</li>
            <li>Future work can swap this derived score for bureau-backed data without changing the page structure.</li>
          </ul>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Suggested actions</h2>
          {loans.map((loan) => (
            <div key={loan.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{loan.type}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{formatCurrency(loan.nextPayment)} next</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Paying down {formatCurrency(loan.balance)} would materially improve utilization and debt load.</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
