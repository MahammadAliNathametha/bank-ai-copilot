"use client";

import { ShieldCheck, Clock, Send } from "lucide-react";
import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WireWorkspace() {
  return (
    <SectionShell 
      eyebrow="Payments" 
      title="Wire Transfers" 
      description="Execute high-value domestic and international transfers with SWIFT/FedWire settlement."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard label="Daily Limit" value="$100,000" note="Standard FedWire cap." />
        <MetricCard label="Settlement" value="T+0" note="Domestic cut-off: 4 PM EST." />
        <MetricCard label="Global Reach" value="200+" note="Countries reachable via SWIFT." />
        <MetricCard label="Fees" value="$25.00" note="Standard domestic outgoing." />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">New Wire Request</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="wire-type" className="text-[10px] font-bold uppercase text-slate-500">Wire Type</label>
                <select id="wire-type" className="flex h-10 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white">
                  <option>Domestic (USA)</option>
                  <option>International (SWIFT)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="wire-amount" className="text-[10px] font-bold uppercase text-slate-500">Amount (USD)</label>
                <Input id="wire-amount" type="number" placeholder="0.00" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label htmlFor="wire-bank" className="text-[10px] font-bold uppercase text-slate-500">Recipient Bank Name</label>
              <Input id="wire-bank" placeholder="e.g. JPMorgan Chase" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="wire-routing" className="text-[10px] font-bold uppercase text-slate-500">Routing / SWIFT</label>
                <Input id="wire-routing" placeholder="021000021" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="wire-account" className="text-[10px] font-bold uppercase text-slate-500">Account Number</label>
                <Input id="wire-account" placeholder="000000000" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
              <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-[11px] text-amber-500/80 leading-5">
                Wires are permanent and cannot be reversed. Verify all recipient details carefully before submitting.
              </p>
            </div>

            <Button className="w-full py-6 font-bold text-base">Schedule Wire Transfer</Button>
          </div>
        </Card>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h4 className="font-bold text-white mb-4">Saved Instructions</h4>
            <div className="space-y-3">
              {['Hedge Fund Liquidity', 'Paris Real Estate', 'Family Overseas'].map(item => (
                <div key={item} className="p-3 rounded-lg border border-white/5 bg-white/5 flex items-center justify-between group hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="text-sm text-slate-300 font-medium">{item}</span>
                  <Send className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary" />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 bg-sky-500/5 border-sky-500/20">
            <Clock className="h-5 w-5 text-sky-400 mb-2" />
            <p className="text-xs font-bold text-white mb-1">Domestic Cut-off</p>
            <p className="text-[10px] text-slate-400">FedWire closes in 2 hours 15 minutes for same-day processing.</p>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
