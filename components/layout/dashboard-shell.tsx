"use client";

import { useTenant } from "@/components/providers/tenant-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { ChevronDown, CheckCircle2 } from "lucide-react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isLoading } = useTenant();

  if (isLoading) {
    return (
      <main className="flex min-h-screen bg-background text-foreground">
        <div className="w-[72px] border-r border-white/10 animate-pulse bg-white/5" />
        <div className="flex-1 p-6 space-y-6">
          <div className="h-14 w-full rounded-xl border border-white/10 bg-white/5 animate-pulse" />
          <div className="h-[400px] rounded-xl border border-white/10 bg-white/5 animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 px-6 backdrop-blur-xl z-40">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-display">BTC/USDT</h1>
              <span className="text-xs font-mono font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">BYBIT: $91,302</span>
            </div>
            <div className="hidden items-center gap-8 md:flex">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Change</span>
                <span className="text-sm font-bold text-emerald-400 font-display">5,770.80 +6.71%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">24h High</span>
                <span className="text-sm font-bold text-white font-display">95,000.00</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">24h Low</span>
                <span className="text-sm font-bold text-white font-display">85,050.60</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</span>
                <div className="flex items-center gap-1.5 mt-1 justify-center">
                   <div className="h-1 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                   <div className="h-1 w-3 rounded-full bg-emerald-500/40" />
                   <div className="h-1 w-3 rounded-full bg-rose-500/40" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-bold border border-white/5 bg-white/5 px-4 py-2 rounded-xl hover:bg-white/10 cursor-pointer transition shadow-sm">
              <span className="text-slate-400">Account</span>
              <span className="text-white">MetaMask</span>
              <ChevronDown className="h-3 w-3 text-slate-400 ml-1" />
            </div>
            <div className="flex items-center gap-2 text-sm text-white font-bold bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl cursor-pointer hover:bg-primary/20 transition shadow-[0_0_20px_rgba(255,153,0,0.1)] group">
              <div className="flex items-center justify-center p-0.5 rounded-full bg-primary text-black group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-3 w-3" />
              </div>
              <span className="font-mono">0x7cdb...036a</span>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-[#050505]">
          {children}
        </div>
      </div>
    </main>
  );
}
