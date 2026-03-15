"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Activity, Layers } from "lucide-react";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { AccountRecord, UserProfile } from "@/lib/data/mock-bank-store";

export function AdminSaasWorkspace() {
  const { data: users } = useSuspenseQuery({
    queryKey: ["users", "saas"],
    queryFn: () => apiRequest<UserProfile[]>("/api/users")
  });
  
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "saas"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Mock SaaS Metrics for Step 11
  const saasMetrics = {
    mau: Math.round(users.length * 0.85),
    mrr: users.length * 45,
    churn: "1.2%",
    usageGrowth: "+14.5%",
    topTenants: [
      { id: "t1", name: "Ahmedabad Bank", revenue: "$4,500", health: "Healthy" },
      { id: "t2", name: "Gujarat CU", revenue: "$3,200", health: "Healthy" },
      { id: "t3", name: "Surat Trust", revenue: "$2,800", health: "At Risk" },
    ]
  };

  return (
    <SectionShell
      eyebrow="SaaS Admin"
      title="Platform Operations & Economics"
      description="Monitor multi-tenant health, recurring revenue, and portfolio-wide adoption metrics."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Monthly Active (MAU)" value={String(saasMetrics.mau)} note="85% of total user base." />
        <MetricCard label="Projected MRR" value={formatCurrency(saasMetrics.mrr)} note="Subscription revenue." />
        <MetricCard label="Revenue Churn" value={saasMetrics.churn} note="Last 30 days." />
        <MetricCard label="Usage Growth" value={saasMetrics.usageGrowth} note="API activity volume." />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Performance</h3>
          <div className="h-[300px] w-full flex items-end gap-2 px-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`rev-${i}`} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-lg" style={{ height: `${40 + Math.random() * 50}%` }} />
                <span className="text-[10px] text-slate-500 font-bold">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-white mb-4">Adoption Funnel</h3>
            <div className="space-y-4">
              {[
                { label: "Signups", value: "1,245", percent: 100 },
                { label: "KYC Verified", value: "982", percent: 78 },
                { label: "First Deposit", value: "842", percent: 67 },
                { label: "Active Savers", value: "412", percent: 33 },
              ].map(step => (
                <div key={step.label} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400">{step.label}</span>
                    <span className="text-white">{step.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${step.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-white mb-4">Support Load</h3>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white font-display">14</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Open Tickets</p>
              </div>
            </div>
            <p className="hidden">{totalBalance}</p>
          </Card>
        </div>
      </div>

      <Card className="p-0 overflow-hidden mt-6">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h3 className="font-bold text-white">Tenant Portfolio</h3>
          <Layers className="h-4 w-4 text-slate-500" />
        </div>
        <div className="divide-y divide-white/5">
          <div className="grid grid-cols-4 p-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <span>Tenant</span>
            <span>MRR Contribution</span>
            <span>Support Health</span>
            <span className="text-right">Action</span>
          </div>
          {saasMetrics.topTenants.map((tenant) => (
            <div key={tenant.id} className="grid grid-cols-4 p-4 hover:bg-white/[0.01] transition-colors items-center">
              <span className="text-sm font-bold text-white">{tenant.name}</span>
              <span className="text-sm text-slate-300 font-mono">{tenant.revenue}</span>
              <span className={`text-[10px] font-bold ${tenant.health === 'Healthy' ? 'text-emerald-400' : 'text-amber-500'}`}>
                {tenant.health}
              </span>
              <div className="text-right">
                <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-wider">Configure</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </SectionShell>
  );
}
