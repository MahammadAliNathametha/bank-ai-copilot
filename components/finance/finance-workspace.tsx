"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Leaf, Award, ShieldCheck } from "lucide-react";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
      title="Personal Finance Control Room"
      description="Monitor your financial health, sustainability impact, and account performance in real-time."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total balance" value={formatCurrency(insights.totalBalance)} note="Across all products." />
        <MetricCard label="Monthly spend" value={formatCurrency(insights.monthlySpend)} note="Trailing 30 days." />
        <MetricCard label="Savings rate" value={`${Math.round(insights.savingsRate * 100)}%`} note="Pace vs income." />
        <MetricCard label="Health score" value={String(insights.healthScore)} note="Overall behavioral signal." />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Top Outflows</h3>
              <div className="space-y-4">
                {topOutflows.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-white">{transaction.description}</p>
                      <p className="text-[10px] text-slate-500">{transaction.category} · {transaction.date}</p>
                    </div>
                    <p className="text-sm font-bold text-white">{formatCurrency(transaction.amount)}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Carbon Footprint (SaaS Mock)</h3>
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="size-32 rounded-full border-[8px] border-emerald-500/10 flex flex-col items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-[8px] border-emerald-500 border-t-transparent -rotate-45" />
                  <Leaf className="h-6 w-6 text-emerald-500 mb-1" />
                  <p className="text-xl font-bold text-white">420kg</p>
                  <p className="text-[10px] text-slate-500 uppercase">CO2e</p>
                </div>
                <p className="text-[11px] text-center text-slate-400">Your spending is <span className="text-emerald-400">12% more sustainable</span> than the local average.</p>
                <Button variant="secondary" className="h-9 w-full text-[11px] font-bold border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">Offset Emissions</Button>
              </div>
            </Card>
          </div>

          <Card className="p-6">
             <h3 className="text-lg font-bold text-white mb-6">Spending Analysis</h3>
             <div className="h-40 w-full flex items-end gap-1 px-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={`bar-${i}`} 
                    className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-sm" 
                    style={{ height: `${20 + Math.random() * 80}%` }}
                  />
                ))}
             </div>
             <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span>30 Days Ago</span>
                <span>Today</span>
             </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-white mb-4">Portfolio Posture</h3>
            <div className="space-y-3">
              {liquidAccounts.map((account) => (
                <div key={account.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-white">{account.name}</p>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0a0a0a] text-slate-500 border border-white/5">{account.type}</span>
                  </div>
                  <p className="text-lg font-bold text-primary font-display">{formatCurrency(account.balance)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Award className="h-6 w-6" />
              <h4 className="font-bold text-sm tracking-tight text-white">Savings Challenge</h4>
            </div>
            <p className="text-[10px] text-slate-400 leading-5 mb-4">
              You are <span className="text-white font-bold">$120 away</span> from hitting your target goal for Ahmedabad Bank&apos;s &quot;Summer Saver&quot; rewards tier.
            </p>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-primary" style={{ width: '85%' }} />
            </div>
            <Button className="w-full text-[11px] font-bold h-9">View Challenge</Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4 text-sky-400">
              <ShieldCheck className="h-6 w-6" />
              <h4 className="font-bold text-sm tracking-tight text-white">Smart Advice</h4>
            </div>
            <div className="space-y-4">
              {insights.insights.slice(0, 2).map((insight) => (
                <div key={insight.id} className="p-3 rounded-lg bg-[#0a0a0a] border border-white/5">
                  <p className="text-[11px] leading-5 text-slate-400">{insight.summary}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
