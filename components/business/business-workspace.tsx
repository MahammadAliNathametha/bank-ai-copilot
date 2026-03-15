"use client";

import { Briefcase } from "lucide-react";
import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BusinessWorkspace() {
  return (
    <SectionShell 
      eyebrow="Services" 
      title="Business Banking Suite" 
      description="Manage your enterprise treasury, payroll, and corporate credit within a single unified workspace."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard label="Operating Capital" value="$452,000" note="Across 4 business accounts." />
        <MetricCard label="Pending Payroll" value="$82,450" note="Due in 3 days (12 employees)." />
        <MetricCard label="Credit Line" value="$250,000" note="$120k utilized (Fixed 8.2%)." />
        <MetricCard label="Tax Provision" value="$42,000" note="Q1 estimated payment ready." />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6">Treasury Overview</h3>
          <div className="space-y-4">
            {[
              { name: "Main Operating", balance: "$284,500.00", change: "+12.5%" },
              { name: "Payroll Reserve", balance: "$120,450.00", change: "+0.0%" },
              { name: "Merchant Settlement", balance: "$47,050.22", change: "+4.2%" },
            ].map(acct => (
              <div key={acct.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{acct.name}</p>
                    <p className="text-[10px] text-slate-500">Active Account</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{acct.balance}</p>
                  <p className="text-[10px] text-emerald-400">{acct.change}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h4 className="font-bold text-white mb-4">Merchant Services</h4>
            <div className="space-y-4">
              <div className="text-center p-4 rounded-xl bg-[#0a0a0a] border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Today&apos;s Sales</p>
                <p className="text-2xl font-bold text-white font-display">$4,285.90</p>
              </div>
              <Button className="w-full h-10 text-xs font-bold">Launch Merchant Portal</Button>
            </div>
          </Card>
          <Card className="p-6">
            <h4 className="font-bold text-white mb-2">Corporate Cards</h4>
            <p className="text-[10px] text-slate-500 mb-4">5 cards active for employees.</p>
            <Button variant="secondary" className="w-full h-10 text-xs font-bold border-white/10 uppercase tracking-wider">Manage Cards</Button>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
