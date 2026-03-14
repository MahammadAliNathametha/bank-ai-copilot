"use client";

import { useState } from "react";
import {
  CreditCard, Plus, Smartphone, Eye, EyeOff,
  Send, ArrowDownToLine, QrCode, Shield,
  ChevronRight, Nfc
} from "lucide-react";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";

/* ── mock wallet data ──────────────────────────────────────────────── */
const walletCards = [
  { id: 1, type: "Apple Pay" as const, last4: "4829", brand: "Visa", status: "active" as const, addedAt: "Jan 2024", color: "from-[#1a1a2e] to-[#16213e]" },
  { id: 2, type: "Google Pay" as const, last4: "7391", brand: "Mastercard", status: "active" as const, addedAt: "Mar 2024", color: "from-[#1a2e1a] to-[#162e21]" },
  { id: 3, type: "Samsung Pay" as const, last4: "2156", brand: "Visa", status: "suspended" as const, addedAt: "Jun 2024", color: "from-[#2e1a1a] to-[#2e1621]" },
];

const recentActivity = [
  { id: 1, merchant: "Starbucks", method: "Apple Pay", amount: -5.75, time: "Today, 8:32 AM", category: "Food & Drink" },
  { id: 2, merchant: "Uber", method: "Google Pay", amount: -23.40, time: "Today, 7:15 AM", category: "Transport" },
  { id: 3, merchant: "Amazon", method: "Apple Pay", amount: -89.99, time: "Yesterday", category: "Shopping" },
  { id: 4, merchant: "Netflix", method: "Google Pay", amount: -15.99, time: "Yesterday", category: "Entertainment" },
  { id: 5, merchant: "Whole Foods", method: "Apple Pay", amount: -67.23, time: "2 days ago", category: "Groceries" },
];

const loyaltyCards = [
  { id: 1, name: "Delta SkyMiles", points: 42850, tier: "Gold", color: "#8B2252" },
  { id: 2, name: "Marriott Bonvoy", points: 128400, tier: "Platinum", color: "#1C1C1C" },
  { id: 3, name: "Chase Rewards", points: 34200, tier: "Preferred", color: "#003DA5" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(value));
}

const PayTypeIcon = ({ type }: { type: string }) => {
  if (type === "Apple Pay") return <span className="text-lg">🍎</span>;
  if (type === "Google Pay") return <span className="text-lg">G</span>;
  return <Smartphone className="h-5 w-5" />;
};

export function WalletWorkspace() {
  const [showBalances, setShowBalances] = useState(true);
  const [activeTab, setActiveTab] = useState<"cards" | "activity" | "loyalty">("cards");
  const [showAddCard, setShowAddCard] = useState(false);

  const totalSpent = recentActivity.reduce((sum, a) => sum + Math.abs(a.amount), 0);

  const tabs = [
    { key: "cards" as const, label: "Digital Cards" },
    { key: "activity" as const, label: "Activity" },
    { key: "loyalty" as const, label: "Loyalty & Rewards" },
  ];

  return (
    <SectionShell
      eyebrow="Digital Wallet"
      title="Manage digital payment methods, contactless cards & rewards"
      description="Add cards to Apple Pay, Google Pay, and Samsung Pay. Track contactless transactions and loyalty rewards in one place."
    >
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-white/10 bg-[#0a0a0a] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-primary/15 text-primary shadow-[0_0_15px_rgba(255,153,0,0.08)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Digital Cards Tab ────────────────────────────────────────── */}
      {activeTab === "cards" && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Active Wallets" value={String(walletCards.filter(c => c.status === "active").length)} note="Connected payment methods" />
            <MetricCard
              label="This Month"
              value={showBalances ? formatCurrency(totalSpent) : "••••••"}
              note="Contactless payments"
            />
            <MetricCard label="Transactions" value={String(recentActivity.length)} note="Recent wallet payments" />
            <MetricCard label="Rewards Earned" value="$42.30" note="Cashback this month" />
          </div>

          {/* Wallet cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {walletCards.map((card) => (
              <div
                key={card.id}
                className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  card.status === "active"
                    ? "border-white/10 hover:border-white/20"
                    : "border-red-500/20 opacity-70"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-80`} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative space-y-8">
                  <div className="flex items-center justify-between">
                    <PayTypeIcon type={card.type} />
                    <Nfc className="h-5 w-5 text-white/40" />
                  </div>
                  <div>
                    <p className="font-mono text-lg tracking-[0.2em] text-white/90">
                      •••• •••• •••• {card.last4}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/50">{card.type}</p>
                      <p className="text-xs text-white/70">{card.brand}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      card.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {card.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new card */}
            <button
              onClick={() => setShowAddCard(!showAddCard)}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/10 p-6 text-slate-500 hover:border-primary/30 hover:text-primary transition-all duration-300 min-h-[200px]"
            >
              <div className="rounded-xl bg-white/5 p-3">
                <Plus className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold">Add to Wallet</span>
            </button>
          </div>

          {/* Quick Actions */}
          <Card className="space-y-4">
            <h2 className="font-display text-2xl">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: <Send className="h-5 w-5" />, label: "Send", color: "bg-blue-500/15 text-blue-400" },
                { icon: <ArrowDownToLine className="h-5 w-5" />, label: "Request", color: "bg-emerald-500/15 text-emerald-400" },
                { icon: <QrCode className="h-5 w-5" />, label: "Scan QR", color: "bg-purple-500/15 text-purple-400" },
                { icon: <Shield className="h-5 w-5" />, label: "Lock All", color: "bg-red-500/15 text-red-400" },
              ].map((action) => (
                <button
                  key={action.label}
                  className={`flex flex-col items-center gap-2 rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-colors`}
                >
                  <div className={`rounded-xl p-3 ${action.color}`}>{action.icon}</div>
                  <span className="text-xs font-semibold text-slate-300">{action.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* ── Activity Tab ─────────────────────────────────────────────── */}
      {activeTab === "activity" && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent Contactless Payments</h2>
            <button onClick={() => setShowBalances(!showBalances)} className="text-slate-500 hover:text-white transition-colors">
              {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-5 py-4 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{activity.merchant}</p>
                    <p className="text-xs text-slate-500">{activity.method} · {activity.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-400">-{showBalances ? formatCurrency(activity.amount) : "••••"}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Loyalty Tab ──────────────────────────────────────────────── */}
      {activeTab === "loyalty" && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {loyaltyCards.map((card) => (
              <Card key={card.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: card.color }} />
                    <div>
                      <p className="text-sm font-semibold text-white">{card.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">{card.tier}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Points Balance</p>
                  <p className="font-display text-3xl text-white mt-1">{card.points.toLocaleString()}</p>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── Add Card Modal ──────────────────────────────────────────── */}
      {showAddCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-8 shadow-2xl">
            <button onClick={() => setShowAddCard(false)} className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-500 hover:text-white hover:bg-white/10 transition-colors">✕</button>
            <h3 className="font-display text-2xl text-white mb-6">Add to Digital Wallet</h3>
            <div className="space-y-3">
              {["Apple Pay", "Google Pay", "Samsung Pay"].map((service) => (
                <button
                  key={service}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <PayTypeIcon type={service} />
                    <span className="font-medium text-white">{service}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">Your card will be tokenized for secure contactless payments.</p>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
