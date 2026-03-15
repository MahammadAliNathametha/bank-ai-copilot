"use client";

import { Target, TrendingUp, AlertCircle, ShoppingCart, Home, Car, Utensils } from "lucide-react";
import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BudgetWorkspace() {
  return (
    <SectionShell
      eyebrow="Finance"
      title="Budget & Spending Analysis"
      description="Track your spending across categories, set savings targets, and visualize your financial health with AI-powered forecasting."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard label="Monthly Spend" value="$3,450" note="12% lower than last month." />
        <MetricCard label="Safely Spend" value="$842" note="Remaining for the current cycle." />
        <MetricCard label="Savings Rate" value="18.5%" note="Targeting 20% for early retirement." />
        <MetricCard label="Subscriptions" value="$142" note="Recurring monthly commitments." />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Spending by Category</h3>
            <Button variant="ghost" className="text-xs text-slate-400">This Month</Button>
          </div>
          
          <div className="space-y-6">
            {[
              { label: "Housing", amount: 1800, limit: 1800, color: "bg-primary", icon: Home },
              { label: "Food & Dining", amount: 650, limit: 800, color: "bg-emerald-500", icon: Utensils },
              { label: "Transport", amount: 420, limit: 400, color: "bg-rose-500", icon: Car },
              { label: "Shopping", amount: 280, limit: 500, color: "bg-sky-500", icon: ShoppingCart },
            ].map((cat) => (
              <div key={cat.label} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <cat.icon className="h-3 w-3 text-slate-400" />
                    <span className="font-bold text-white uppercase tracking-wider">{cat.label}</span>
                  </div>
                  <span className="font-mono text-slate-400">
                    <span className="text-white">${cat.amount}</span> / ${cat.limit}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${cat.color} transition-all duration-1000`} 
                    style={{ width: `${Math.min((cat.amount / cat.limit) * 100, 100)}%` }}
                  />
                </div>
                {cat.amount > cat.limit && (
                  <p className="flex items-center gap-1.5 text-[10px] text-rose-500 font-medium">
                    <AlertCircle className="h-3 w-3" /> Over budget by ${cat.amount - cat.limit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-[#111] to-[#0a0a0a]">
            <h3 className="text-lg font-bold text-white mb-4">Financial Goals</h3>
            <div className="space-y-4">
              {[
                { name: "New Car Fund", target: 35000, current: 12450, deadline: "Dec 2026" },
                { name: "Home Downpay", target: 80000, current: 45000, deadline: "Aug 2027" },
              ].map((goal) => (
                <div key={goal.name} className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{goal.name}</p>
                        <p className="text-[10px] text-slate-500">Target: ${goal.target.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">${goal.current.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-500">{Math.round((goal.current / goal.target) * 100)}% complete</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-primary transition-all duration-1000" 
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <Button variant="secondary" className="w-full h-11 text-xs font-bold border-white/10 hover:bg-white/5 uppercase tracking-wider">
                Create New Goal
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-400" />
              AI Cash Flow Prediction
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Based on your recurring bills and historical spending, we predict you will have <span className="text-white font-bold">$1,245.00</span> available by the end of this month.
            </p>
            <div className="h-16 flex items-end gap-1 px-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={`pred-${i}`} 
                  className="flex-1 bg-white/5 hover:bg-sky-400/50 transition-colors rounded-t-sm" 
                  style={{ height: `${20 + Math.random() * 80}%` }}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
