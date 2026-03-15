"use client";

import { FileText, Download, Calculator, AlertCircle } from "lucide-react";
import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TaxWorkspace() {
  return (
    <SectionShell 
      eyebrow="Finance" 
      title="Tax Center" 
      description="Download official tax forms, estimate your liability, and track deductible business expenses."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard label="Tax Year" value="2025" note="Filing season active." />
        <MetricCard label="Forms Ready" value="3" note="1099-INT, 1099-B, 1098." />
        <MetricCard label="Estimated Due" value="$12,450" note="Based on realized gains." />
        <MetricCard label="File Status" value="Incomplete" note="Awaiting broker data." />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/[0.02]">
              <h3 className="font-bold text-white">Available Tax Documents</h3>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { name: "2024 Form 1099-INT", type: "Interest Income", size: "1.2 MB" },
                { name: "2024 Form 1099-B", type: "Brokerage Proceeds", size: "2.5 MB" },
                { name: "2024 Form 1098", type: "Mortgage Interest", size: "0.8 MB" },
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{doc.name}</p>
                      <p className="text-[10px] text-slate-500">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="h-9 w-9 text-slate-400 hover:text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Tax Liability Projection</h3>
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Realized Gains</p>
                <p className="text-xl font-bold text-white font-display">$42,900.50</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interest Earned</p>
                <p className="text-xl font-bold text-white font-display">$1,245.22</p>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden flex">
              <div className="h-full bg-primary" style={{ width: '70%' }} />
              <div className="h-full bg-sky-500" style={{ width: '15%' }} />
            </div>
            <div className="mt-4 flex gap-6 text-[10px] font-medium text-slate-500">
              <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-primary" /> Capital Gains</div>
              <div className="flex items-center gap-1.5"><div className="size-2 rounded-full bg-sky-500" /> Interest</div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 text-amber-500 mb-3">
              <AlertCircle className="h-5 w-5" />
              <h4 className="font-bold text-sm tracking-tight">Filing Deadline</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              The IRS tax filing deadline for individual returns is <span className="text-white font-bold">April 15, 2026</span>. Don&apos;t forget to schedule your payments.
            </p>
            <Button variant="secondary" className="w-full h-9 text-[11px] font-bold border-amber-500/30 text-amber-500">Request Extension</Button>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Calculator className="h-5 w-5" />
              <h4 className="font-bold text-sm tracking-tight">Smart Deductions</h4>
            </div>
            <p className="text-[10px] text-slate-500 leading-5">
              We&apos;ve identified <span className="text-white font-bold">42 transactions</span> that may qualify as tax-deductible expenses.
            </p>
            <Button className="w-full mt-4 h-9 text-[11px] font-bold">Review Expenses</Button>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
