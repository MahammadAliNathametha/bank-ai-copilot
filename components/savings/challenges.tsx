"use client";

import { Card } from "@/components/ui/card";
import { Trophy, Flame } from "lucide-react";

export function SavingsChallenges() {
  const challenges = [
    { id: 1, title: "7-Day No Spend", progress: 4, total: 7, points: 50, active: true },
    { id: 2, title: "Emergency Fund Starter", progress: 850, total: 1000, points: 200, active: true },
    { id: 3, title: "Coffee Swap", progress: 12, total: 20, points: 30, active: false },
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Challenges
        </h2>
        <span className="text-xs font-bold text-primary">840 pts</span>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge) => (
          <div key={challenge.id} className={`rounded-2xl border p-4 transition-all ${
            challenge.active ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/10 opacity-60"
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white text-sm">{challenge.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Earn {challenge.points} points</p>
              </div>
              {challenge.active && <Flame className="h-4 w-4 text-primary animate-pulse" />}
            </div>
            
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500">Progress</span>
                <span className="text-white font-bold">{challenge.progress} / {challenge.total}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${(challenge.progress / challenge.total) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
