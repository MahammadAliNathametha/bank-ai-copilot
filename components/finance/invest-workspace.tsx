"use client";

import { Search, Bitcoin } from "lucide-react";
import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InvestWorkspace() {
  return (
    <SectionShell 
      eyebrow="Finance" 
      title="Investment Portfolio" 
      description="Monitor your brokerage accounts, retirement funds, and digital assets in real-time."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard label="Total Value" value="$184,520" note="+$1,245.00 (Today)" />
        <MetricCard label="Day Gain" value="+0.68%" note="Outperforming S&P 500." />
        <MetricCard label="Return YTD" value="+12.4%" note="Annualized: +15.2%." />
        <MetricCard label="Buying Power" value="$12,900" note="Ready for deployment." />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card className="p-6 bg-[#0a0a0a] border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white font-display">Portfolio Performance</h3>
                <p className="text-xs text-slate-500">Comparison against major indices</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="h-8 text-[10px] px-3 font-bold">1D</Button>
                <Button variant="ghost" className="h-8 text-[10px] px-3 font-bold text-slate-500 hover:text-white">1W</Button>
                <Button variant="ghost" className="h-8 text-[10px] px-3 font-bold text-slate-500 hover:text-white">1M</Button>
                <Button variant="ghost" className="h-8 text-[10px] px-3 font-bold text-slate-500 hover:text-white">1Y</Button>
              </div>
            </div>
            
            <div className="h-[240px] w-full flex items-end gap-[1px]">
              {Array.from({ length: 60 }).map((_, i) => (
                <div 
                  key={`perf-${i}`} 
                  className="flex-1 bg-primary/20 hover:bg-primary transition-all cursor-pointer rounded-t-sm" 
                  style={{ height: `${30 + Math.sin(i * 0.2) * 20 + Math.random() * 30}%` }}
                />
              ))}
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white">Top Holdings</h3>
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <div className="divide-y divide-white/5">
              {[
                { id: "h1", name: "Apple Inc.", symbol: "AAPL", price: "$214.50", change: "+1.2%", value: "$45,200" },
                { id: "h2", name: "Tesla, Inc.", symbol: "TSLA", price: "$182.20", change: "-0.5%", value: "$32,100" },
                { id: "h3", name: "NVIDIA Corp.", symbol: "NVDA", price: "$912.40", change: "+4.1%", value: "$28,450" },
              ].map((stock) => (
                <div key={stock.id} className="flex items-center justify-between p-4 hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-xs text-slate-400">
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{stock.name}</p>
                      <p className="text-[10px] text-slate-500">{stock.symbol} • {stock.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{stock.value}</p>
                    <p className={`text-[10px] font-bold ${stock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {stock.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-white mb-6">Asset Allocation</h3>
            <div className="flex flex-col items-center py-4">
              <div className="size-40 rounded-full border-[12px] border-white/5 relative flex items-center justify-center">
                <div className="absolute inset-[-12px] rounded-full border-[12px] border-primary border-r-transparent border-b-transparent rotate-45" />
                <div className="absolute inset-[-12px] rounded-full border-[12px] border-sky-500 border-l-transparent border-t-transparent -rotate-12" />
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Growth</p>
                  <p className="text-xl font-bold text-white">72%</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { label: "Equities", percent: "72%", color: "bg-primary" },
                { label: "Fixed Income", percent: "18%", color: "bg-sky-500" },
                { label: "Crypto", percent: "8%", color: "bg-orange-500" },
                { label: "Cash", percent: "2%", color: "bg-slate-500" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${item.color}`} />
                  <span className="text-[10px] font-bold text-white">{item.percent}</span>
                  <span className="text-[10px] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-orange-500/5 border-orange-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Bitcoin className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-xs font-bold text-white">Crypto Pulse</p>
                <p className="text-[10px] text-slate-500">Bitcoin at $91,302 (+6.7%)</p>
              </div>
            </div>
            <Button variant="secondary" className="w-full h-9 text-[11px] font-bold border-orange-500/30 text-orange-500 hover:bg-orange-500/10">Manage Digital Assets</Button>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
