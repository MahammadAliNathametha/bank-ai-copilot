"use client";

import { Card } from "@/components/ui/card";
import { Leaf, Wind, Droplets, ArrowRight } from "lucide-react";

export function CarbonImpact() {
  const categories = [
    { name: "Transport", value: 120, avg: 150, icon: <Wind className="h-4 w-4" /> },
    { name: "Groceries", value: 85, avg: 90, icon: <Droplets className="h-4 w-4" /> },
    { name: "Dining", value: 45, avg: 40, icon: <Leaf className="h-4 w-4" /> },
  ];

  return (
    <Card className="space-y-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Leaf className="h-32 w-32 text-emerald-500" />
      </div>

      <div>
        <h2 className="font-display text-2xl flex items-center gap-2">
          <Leaf className="h-5 w-5 text-emerald-500" />
          Carbon Footprint
        </h2>
        <p className="text-xs text-slate-500 mt-1">Estimated CO2e based on your spending patterns (kg/mo)</p>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white">
                <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-500">
                  {cat.icon}
                </div>
                {cat.name}
              </div>
              <div className="text-xs">
                <span className="text-white font-bold">{cat.value}kg</span>
                <span className="text-slate-500 ml-1">/ avg {cat.avg}kg</span>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${cat.value > cat.avg ? "bg-amber-500" : "bg-emerald-500"}`} 
                style={{ width: `${(cat.value / 200) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4">
        <p className="text-xs text-emerald-400 font-medium leading-relaxed">
          Your footprint is 12% lower than similar users! Offset your remaining 250kg this month for $3.50.
        </p>
        <button className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:underline">
          Offset Now <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </Card>
  );
}
