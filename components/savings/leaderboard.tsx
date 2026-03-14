"use client";

import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const LEADERBOARD_DATA = [
  { name: "John Doe", score: 980, delta: "+45", rank: 1, isUser: false },
  { name: "You", score: 852, delta: "+12", rank: 2, isUser: true },
  { name: "Jane Smith", score: 720, delta: "-5", rank: 3, isUser: false },
  { name: "Mike Ross", score: 640, delta: "+20", rank: 4, isUser: false },
];

export function SavingsLeaderboard() {
  return (
    <Card className="flex flex-col h-full bg-[#0a0a0a]/40 border-white/5 backdrop-blur-sm overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary text-black shadow-[0_0_20px_rgba(255,153,0,0.3)]">
            <Trophy className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">Top Savers</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Ranking · Tenant #111</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {LEADERBOARD_DATA.map((item) => (
          <div 
            key={item.name} 
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              item.isUser 
              ? 'bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(255,153,0,0.05)]' 
              : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'
            }`}
          >
            <div className="flex-shrink-0 w-8 flex justify-center">
              {(() => {
                if (item.rank === 1) return <Crown className="size-5 text-yellow-400 fill-yellow-400/20" />;
                if (item.rank === 2) return <Medal className="size-5 text-slate-300" />;
                if (item.rank === 3) return <Medal className="size-5 text-amber-600" />;
                return <span className="text-xs font-mono font-bold text-slate-500">#{item.rank.toString().padStart(2, '0')}</span>;
              })()}
            </div>

            <div className="flex-1">
              <p className={`text-sm font-bold ${item.isUser ? 'text-primary' : 'text-white'}`}>
                {item.name} {item.isUser && " (Me)"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.isUser ? 'bg-primary' : 'bg-slate-500'}`} 
                    style={{ width: `${(item.score / 1000) * 100}%` }} 
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500">{item.score} pts</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] font-bold ${item.delta.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.delta}
              </span>
              <TrendingUp className={`size-3 ${item.delta.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 bg-white/[0.02] border-t border-white/5">
        <p className="text-[10px] text-slate-500 text-center font-bold tracking-tight">
          CHALLENGE UNLOCKED: SAVE $500 MORE TO PASS JOHN DOE
        </p>
      </div>
    </Card>
  );
}
