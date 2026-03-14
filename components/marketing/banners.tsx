"use client";

import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Gift, Percent } from "lucide-react";

export function MarketingBanners() {
  const campaigns = [
    {
      id: 1,
      title: "Double Rewards",
      description: "Earn 2x points on all dining this weekend. Activate now!",
      icon: <Gift className="h-5 w-5" />,
      color: "bg-primary/15 text-primary",
      borderColor: "border-primary/20",
    },
    {
      id: 2,
      title: "New: Crypto Staking",
      description: "Stake your ETH and earn up to 4.2% APY. Limited time.",
      icon: <Percent className="h-5 w-5" />,
      color: "bg-blue-500/15 text-blue-400",
      borderColor: "border-blue-500/20",
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {campaigns.map((camp) => (
        <Card key={camp.id} className={`p-5 flex items-start gap-4 hover:border-white/30 transition-all cursor-pointer group ${camp.borderColor}`}>
          <div className={`rounded-2xl p-3 ${camp.color}`}>
            {camp.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white">{camp.title}</h3>
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            </div>
            <p className="mt-1 text-xs text-slate-400 line-clamp-1">{camp.description}</p>
            <button className="mt-3 flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">
              Claim Offer <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
