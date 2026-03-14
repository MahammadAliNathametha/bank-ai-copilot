"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown, ArrowUp, ArrowDown, Activity, Box, Settings, SlidersHorizontal, Settings2 } from "lucide-react";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { apiRequest } from "@/lib/services/http";
import type { AccountRecord } from "@/lib/data/mock-bank-store";

export function DashboardOverview() {
  useSupabaseRealtime(["accounts"]);

  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-8rem)]">
      {/* Left Column: Chart Area */}
      <div className="flex-1 flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-medium tracking-tight">Chart</h2>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <span className="text-white bg-white/5 px-3 py-1.5 rounded-lg cursor-pointer transition hover:bg-[#0a0a0a]/20">1D</span>
              <span className="cursor-pointer hover:text-white transition">5D</span>
              <span className="cursor-pointer hover:text-white transition">1W</span>
              <span className="cursor-pointer hover:text-white transition">1M</span>
              <span className="cursor-pointer hover:text-white transition">1Y</span>
              <div className="w-px h-4 bg-white/5 ml-2" />
              <Activity className="h-4 w-4 cursor-pointer hover:text-white ml-2" />
              <Box className="h-4 w-4 cursor-pointer hover:text-white" />
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-white/5 transition">
              <Activity className="h-3.5 w-3.5" />
              AI predicted
            </div>
            <Settings2 className="h-4 w-4 text-slate-400 cursor-pointer hover:text-white transition" />
          </div>
        </div>

        {/* Decorative Chart Area wrapper to match the dark look */}
        <div className="flex-1 relative mt-4 rounded-2xl flex flex-col border border-white/5 bg-[#050505] mb-12 overflow-hidden group/chart">
           {/* Chart Legend / Metadata */}
           <div className="absolute top-4 left-6 text-[11px] font-bold z-20 pointer-events-none">
              <div className="flex items-center gap-4 mb-1">
                <span className="text-primary tracking-wider font-mono">BTC / USDT · 1D · KUCH</span>
                <span className="text-emerald-400 font-mono">O94269.99 H94416.46 L91142.00 C93849.02</span>
                <span className="text-emerald-400/60 font-mono">+2390.00 (+2.54%)</span>
              </div>
              <div className="text-slate-500 font-medium font-mono">Volume SMA 9 28 · <span className="text-sky-400">1.24K</span></div>
           </div>

           {/* Main SVG Chart Area */}
           <div className="flex-1 relative w-full h-full p-0">
             <svg className="w-full h-full absolute inset-0 pointer-events-none overflow-visible">
               <defs>
                 <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                   <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                 </linearGradient>
                 <filter id="glow">
                   <feGaussianBlur stdDeviation="4" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
                 </filter>
               </defs>

               {/* Grid Lines */}
               {Array.from({ length: 5 }).map((_, i) => (
                 <line 
                   key={i} 
                   x1="0" y1={`${20 * (i + 1)}%`} 
                   x2="100%" y2={`${20 * (i + 1)}%`} 
                   stroke="rgba(255,255,255,0.03)" 
                   strokeWidth="1" 
                 />
               ))}

               {/* Main Trend Line Area */}
               <path 
                 d="M 0 320 Q 200 280, 400 350 T 800 200 T 1200 150 L 1200 800 L 0 800 Z" 
                 className="fill-[url(#chartGradient)] transition-all duration-1000"
               />
               
               {/* Main Trend Line Stroke */}
               <path 
                 d="M 0 320 Q 200 280, 400 350 T 800 200 T 1200 150" 
                 fill="none" 
                 stroke="hsl(var(--primary))" 
                 strokeWidth="2.5" 
                 strokeLinecap="round" 
                 filter="url(#glow)"
                 className="transition-all duration-1000"
               />

               {/* Current Price Marker */}
               <circle cx="1200" cy="150" r="4" fill="hsl(var(--primary))" className="animate-pulse" />
               <line x1="0" y1="150" x2="1600" y2="150" stroke="hsl(var(--primary)/0.2)" strokeWidth="1" strokeDasharray="4 4" />
             </svg>

             {/* Volume Bars (Simulated at bottom) */}
             <div className="absolute bottom-0 left-0 right-16 h-32 flex items-end gap-[2px] px-6 pb-6 opacity-30">
               {Array.from({ length: 80 }).map((_, i) => {
                 const height = Math.random() * 80 + 20;
                 const isGreen = Math.random() > 0.4;
                 return (
                   <div 
                     key={i} 
                     className={`flex-1 rounded-t-sm transition-all duration-500 hover:opacity-100 ${isGreen ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                     style={{ height: `${height}%` }}
                   />
                 )
               })}
             </div>

             {/* Crosshair effect (Fixed Position for Mockup) */}
             <div className="absolute top-0 bottom-0 left-[65%] w-px bg-white/10 z-10 pointer-events-none group-hover/chart:translate-x-10 transition-transform duration-300">
               <div className="absolute top-[35%] -translate-y-1/2 -left-1 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
               <div className="absolute top-[35%] -translate-y-1/2 left-4 bg-white text-black text-[10px] font-bold px-2 py-1 rounded">93,849.02</div>
             </div>
           </div>
           
           {/* Side Price Axis */}
           <div className="absolute right-0 top-0 bottom-0 w-16 border-l border-white/5 flex flex-col justify-between py-10 items-end pr-3 text-[10px] font-bold font-mono text-slate-500 bg-[#0a0a0a]/40 backdrop-blur-sm">
              <span>98,500.00</span>
              <span>96,000.00</span>
              <span>94,000.00</span>
              <div className="relative w-full flex justify-end">
                <span className="bg-primary text-black px-1.5 py-0.5 rounded font-bold mr-[-10px] z-10 shadow-lg border border-white/10">93,849.02</span>
              </div>
              <span>92,000.00</span>
              <span>90,000.00</span>
              <span>88,500.00</span>
           </div>

           {/* Bottom Time Axis */}
           <div className="h-10 border-t border-white/5 flex justify-between items-center px-6 text-[10px] font-bold font-mono text-slate-600 bg-[#0a0a0a]/40">
              <span>08:00 AM</span>
              <span>10:00 AM</span>
              <span>12:00 PM</span>
              <span className="text-slate-400">02:00 PM</span>
              <span>04:00 PM</span>
              <span>06:00 PM</span>
              <span>08:00 PM</span>
           </div>
        </div>
      </div>

      {/* Right Column: Trading Panel */}
      <div className="w-full lg:w-[380px] flex flex-col rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium tracking-tight">Trading</h2>
          <SlidersHorizontal className="h-4 w-4 text-slate-400 cursor-pointer hover:text-white" />
        </div>

        {/* Buy/Sell Tabs */}
        <div className="grid grid-cols-2 rounded-xl bg-[#0a0a0a] border border-white/10 p-1 mb-6">
          <button className="flex flex-col items-center justify-center rounded-lg bg-primary/10 border border-primary/20 py-2.5 shadow-sm">
            <span className="text-sm font-bold text-primary">Buy BTC</span>
            <span className="text-[10px] text-primary/60 font-medium">43 255.38 USDT</span>
          </button>
          <button className="flex flex-col items-center justify-center rounded-lg py-2.5 hover:bg-white/5 transition group">
            <span className="text-sm font-medium text-slate-400 group-hover:text-white">Sell BTC</span>
            <span className="text-[10px] text-slate-500">0.54 BTC</span>
          </button>
        </div>

        {/* Order Types */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 text-xs font-semibold">
            <span className="text-slate-400 cursor-pointer hover:text-white transition">Market</span>
            <span className="text-white border-b-2 border-primary pb-1 cursor-pointer">Limit</span>
            <span className="text-slate-400 cursor-pointer hover:text-white transition">Ladder</span>
          </div>
          <Settings className="h-3.5 w-3.5 text-slate-400 cursor-pointer hover:text-white" />
        </div>
        
        <div className="flex items-center gap-2 mb-8 bg-[#0a0a0a] rounded-xl p-1 border border-white/10">
           <button className="flex-1 rounded-lg bg-white/5 py-1.5 text-xs font-medium text-white transition">Limit</button>
           <button className="flex-1 rounded-lg py-1.5 text-xs font-medium text-slate-400 hover:bg-white/5 transition">Stop Limit</button>
           <button className="flex-1 rounded-lg py-1.5 text-xs font-medium text-slate-400 hover:bg-white/5 transition">Trailing Stop</button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 flex flex-col group focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Price</span>
            <div className="flex items-center justify-between mt-2">
               <span className="text-2xl font-bold tracking-tight text-white font-display">87 900.00</span>
               <span className="text-[11px] text-slate-500 font-medium bg-white/5 px-2 py-0.5 rounded-lg">USDT</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-1 text-[11px] font-medium text-slate-400 uppercase">
             <span className="text-rose-500">-1.24%</span>
             <span className="hover:text-white cursor-pointer transition">Bid</span>
             <span className="hover:text-white cursor-pointer transition">Ask</span>
             <span className="hover:text-white cursor-pointer transition">Last</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 flex flex-col group focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Spend</span>
            <div className="flex items-center justify-between mt-2">
               <span className="text-2xl font-bold tracking-tight text-white font-display">2 162.77</span>
               <span className="text-[11px] text-slate-500 font-medium bg-white/5 px-2 py-0.5 rounded-lg">USDT</span>
            </div>
          </div>

          <div className="flex justify-between items-center px-1 pt-2 pb-4 text-[10px] font-medium text-slate-400">
             <span className="hover:text-white cursor-pointer transition bg-white/5 px-2 py-0.5 rounded">5%</span>
             <span className="hover:text-white cursor-pointer transition">5%</span>
             <span className="hover:text-white cursor-pointer transition">15%</span>
             <span className="hover:text-white cursor-pointer transition">25%</span>
             <span className="hover:text-white cursor-pointer transition">50%</span>
             <span className="hover:text-white cursor-pointer transition">100%</span>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 flex flex-col group focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Buy</span>
            <div className="flex items-center justify-between mt-2">
               <span className="text-2xl font-bold tracking-tight text-white font-display">0.02536</span>
               <span className="text-[11px] text-slate-500 font-medium bg-white/5 px-2 py-0.5 rounded-lg">BTC</span>
            </div>
          </div>
        </div>

        <button className="w-full rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary))_65%,hsl(var(--accent)))] py-4 text-sm font-bold text-black shadow-[0_10px_30px_rgba(255,153,0,0.25)] transition-transform active:scale-[0.98] hover:brightness-[1.05] mt-auto">
          Place Order
        </button>
      </div>
    </div>
  );
}
