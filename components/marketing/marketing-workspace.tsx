"use client";

import { useState } from "react";
import {
  Megaphone, Users, Target, Mail,
  Smartphone, Bell, Calendar, CheckCircle2, Clock, PauseCircle, Play,
  ChevronRight, Sparkles
} from "lucide-react";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ── mock campaign data ────────────────────────────────────────────── */
const campaigns = [
  {
    id: 1,
    name: "Spring Savings Promo",
    type: "push" as const,
    status: "active" as const,
    audience: 12450,
    sent: 11800,
    opened: 4720,
    clicked: 1890,
    converted: 378,
    startDate: "Mar 1, 2026",
    endDate: "Mar 31, 2026",
    budget: 5000,
    spent: 3200,
  },
  {
    id: 2,
    name: "Credit Card Upgrade",
    type: "email" as const,
    status: "active" as const,
    audience: 8300,
    sent: 8300,
    opened: 3320,
    clicked: 1162,
    converted: 245,
    startDate: "Mar 5, 2026",
    endDate: "Apr 5, 2026",
    budget: 3000,
    spent: 1500,
  },
  {
    id: 3,
    name: "Mortgage Rate Lock",
    type: "sms" as const,
    status: "paused" as const,
    audience: 5200,
    sent: 2600,
    opened: 1820,
    clicked: 728,
    converted: 94,
    startDate: "Feb 15, 2026",
    endDate: "Mar 15, 2026",
    budget: 2000,
    spent: 980,
  },
  {
    id: 4,
    name: "Refer a Friend Bonus",
    type: "push" as const,
    status: "scheduled" as const,
    audience: 20000,
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    startDate: "Mar 20, 2026",
    endDate: "Apr 20, 2026",
    budget: 8000,
    spent: 0,
  },
];

const channelPerformance = [
  { channel: "Push Notification", icon: <Bell className="h-4 w-4" />, openRate: 38.2, ctr: 15.4, convRate: 3.1, color: "text-purple-400", bg: "bg-purple-500/15" },
  { channel: "Email", icon: <Mail className="h-4 w-4" />, openRate: 42.8, ctr: 14.0, convRate: 2.9, color: "text-blue-400", bg: "bg-blue-500/15" },
  { channel: "SMS", icon: <Smartphone className="h-4 w-4" />, openRate: 72.5, ctr: 28.0, convRate: 3.6, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  { channel: "In-App", icon: <Target className="h-4 w-4" />, openRate: 55.0, ctr: 22.3, convRate: 5.2, color: "text-primary", bg: "bg-primary/15" },
];

const statusConfig = {
  active: { label: "Active", icon: <Play className="h-3 w-3" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  paused: { label: "Paused", icon: <PauseCircle className="h-3 w-3" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  scheduled: { label: "Scheduled", icon: <Clock className="h-3 w-3" />, color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  completed: { label: "Completed", icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
};

export function MarketingWorkspace() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "analytics" | "segments">("campaigns");

  const totalAudience = campaigns.reduce((s, c) => s + c.audience, 0);
  const totalConverted = campaigns.reduce((s, c) => s + c.converted, 0);
  const avgOpenRate = campaigns.filter(c => c.sent > 0).reduce((s, c) => s + (c.opened / c.sent) * 100, 0) / campaigns.filter(c => c.sent > 0).length;

  const tabs = [
    { key: "campaigns" as const, label: "Campaigns" },
    { key: "analytics" as const, label: "Analytics" },
    { key: "segments" as const, label: "Audience Segments" },
  ];

  return (
    <SectionShell
      eyebrow="Marketing"
      title="Contextual campaign management, audience targeting & performance"
      description="Create, manage, and track multi-channel marketing campaigns with audience segmentation, A/B testing, and real-time conversion analytics."
    >
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

      {/* ── Campaigns Tab ────────────────────────────────────────────── */}
      {activeTab === "campaigns" && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Active Campaigns" value={String(campaigns.filter(c => c.status === "active").length)} note="Currently running" />
            <MetricCard label="Total Reach" value={totalAudience.toLocaleString()} note="Across all campaigns" />
            <MetricCard label="Conversions" value={String(totalConverted)} note="This month" />
            <MetricCard label="Avg Open Rate" value={`${avgOpenRate.toFixed(1)}%`} note="Across channels" />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-white">Campaign Dashboard</h2>
            <Button>
              <Megaphone className="h-4 w-4 mr-1.5" />
              New Campaign
            </Button>
          </div>

          <div className="space-y-3">
            {campaigns.map((campaign) => {
              const openRate = campaign.sent > 0 ? (campaign.opened / campaign.sent * 100) : 0;
              const ctr = campaign.opened > 0 ? (campaign.clicked / campaign.opened * 100) : 0;
              const sc = statusConfig[campaign.status];

              return (
                <Card key={campaign.id} className="space-y-4 hover:border-white/20 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                        <Megaphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white group-hover:text-primary transition-colors">{campaign.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 uppercase">{campaign.type}</span>
                          <span className="text-slate-600">·</span>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="h-3 w-3" />
                            {campaign.startDate} — {campaign.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${sc.color}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  {/* Funnel metrics */}
                  <div className="grid grid-cols-5 gap-3">
                    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">
                      <p className="text-[10px] font-semibold uppercase text-slate-500">Audience</p>
                      <p className="font-display text-lg text-white">{campaign.audience.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">
                      <p className="text-[10px] font-semibold uppercase text-slate-500">Sent</p>
                      <p className="font-display text-lg text-white">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">
                      <p className="text-[10px] font-semibold uppercase text-slate-500">Open Rate</p>
                      <p className="font-display text-lg text-emerald-400">{openRate.toFixed(1)}%</p>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">
                      <p className="text-[10px] font-semibold uppercase text-slate-500">CTR</p>
                      <p className="font-display text-lg text-primary">{ctr.toFixed(1)}%</p>
                    </div>
                    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center">
                      <p className="text-[10px] font-semibold uppercase text-slate-500">Converted</p>
                      <p className="font-display text-lg text-white">{campaign.converted}</p>
                    </div>
                  </div>

                  {/* Budget bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Budget: ${campaign.budget.toLocaleString()}</span>
                      <span>Spent: ${campaign.spent.toLocaleString()} ({campaign.budget > 0 ? (campaign.spent / campaign.budget * 100).toFixed(0) : 0}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-500"
                        style={{ width: `${campaign.budget > 0 ? (campaign.spent / campaign.budget * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* ── Analytics Tab ────────────────────────────────────────────── */}
      {activeTab === "analytics" && (
        <>
          <Card className="space-y-4">
            <h2 className="font-display text-2xl">Channel Performance</h2>
            <div className="space-y-3">
              {channelPerformance.map((ch) => (
                <div key={ch.channel} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-5 py-4 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-xl p-2.5 ${ch.bg} ${ch.color}`}>
                      {ch.icon}
                    </div>
                    <p className="font-medium text-white">{ch.channel}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Open Rate</p>
                      <p className="font-display text-lg text-white">{ch.openRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500">CTR</p>
                      <p className="font-display text-lg text-primary">{ch.ctr}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Conv Rate</p>
                      <p className="font-display text-lg text-emerald-400">{ch.convRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-4">
              <h2 className="font-display text-2xl">Conversion Funnel</h2>
              <div className="space-y-2">
                {[
                  { label: "Total Audience", value: totalAudience, pct: 100, color: "bg-blue-500" },
                  { label: "Messages Sent", value: campaigns.reduce((s, c) => s + c.sent, 0), pct: 73, color: "bg-purple-500" },
                  { label: "Opened", value: campaigns.reduce((s, c) => s + c.opened, 0), pct: 32, color: "bg-primary" },
                  { label: "Clicked", value: campaigns.reduce((s, c) => s + c.clicked, 0), pct: 12, color: "bg-amber-500" },
                  { label: "Converted", value: totalConverted, pct: 2.4, color: "bg-emerald-500" },
                ].map((step) => (
                  <div key={step.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{step.label}</span>
                      <span className="text-white font-semibold">{step.value.toLocaleString()}</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full ${step.color} transition-all duration-700`} style={{ width: `${step.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-display text-2xl">AI Recommendations</h2>
              <div className="space-y-3">
                {[
                  { title: "Optimize send times", desc: "Your ema audience opens 42% more emails between 7-9 AM. Shift \"Credit Card Upgrade\" schedule.", priority: "high" as const },
                  { title: "Segment refinement", desc: "Users with 3+ monthly logins convert 2.8x. Create a high-engagement segment.", priority: "medium" as const },
                  { title: "Re-engage dormant users", desc: "1,240 users haven't opened in 60+ days. Trigger a win-back sequence.", priority: "medium" as const },
                ].map((rec) => (
                  <div key={rec.title} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-white">{rec.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{rec.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* ── Segments Tab ─────────────────────────────────────────────── */}
      {activeTab === "segments" && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Audience Segments</h2>
            <Button><Users className="h-4 w-4 mr-1.5" />Create Segment</Button>
          </div>
          <div className="space-y-3">
            {[
              { name: "High-Value Customers", criteria: "Balance > $50K, 10+ monthly transactions", size: 3420, growth: "+12%" },
              { name: "New Account Holders", criteria: "Account opened < 90 days", size: 1850, growth: "+28%" },
              { name: "Dormant Users", criteria: "No login in 30+ days", size: 4200, growth: "-5%" },
              { name: "Mobile-First Users", criteria: "80%+ sessions on mobile", size: 8900, growth: "+8%" },
              { name: "Credit-Ready", criteria: "Credit score 700+, no active loan", size: 2100, growth: "+3%" },
            ].map((segment) => (
              <div key={segment.name} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-5 py-4 hover:border-white/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-primary transition-colors">{segment.name}</p>
                    <p className="text-xs text-slate-500">{segment.criteria}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-display text-lg text-white">{segment.size.toLocaleString()}</p>
                    <p className={`text-xs font-semibold ${segment.growth.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{segment.growth}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </SectionShell>
  );
}
