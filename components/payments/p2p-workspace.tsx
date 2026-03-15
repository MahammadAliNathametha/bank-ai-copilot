"use client";

import { Send, Search, Zap, Clock, ShieldCheck } from "lucide-react";
import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function P2PWorkspace() {
  return (
    <SectionShell
      eyebrow="Payments"
      title="Peer-to-Peer Transfers"
      description="Send money instantly to friends and family across any participating institution using their email, phone, or digital ID."
    >
      <div className="grid gap-6 md:grid-cols-4">
        <MetricCard label="Instant Limits" value="$5,000" note="Daily cap for real-time rails." />
        <MetricCard label="Active Contacts" value="24" note="Frequent P2P recipients." />
        <MetricCard label="Pending" value="$0.00" note="Inbound requests awaiting approval." />
        <MetricCard label="Safety Tier" value="Standard" note="Basic fraud protection active." />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Send</h3>
            <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-thin">
              {[
                { name: "Sarah J.", avatar: "SJ" },
                { name: "Mike R.", avatar: "MR" },
                { name: "Elena Q.", avatar: "EQ" },
                { name: "David L.", avatar: "DL" },
                { name: "Add New", avatar: "+", special: true },
              ].map((contact) => (
                <button key={contact.name} className="flex flex-col items-center gap-2 group min-w-[70px]">
                  <div className={`size-14 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    contact.special 
                      ? "border-2 border-dashed border-white/20 text-slate-400 group-hover:border-primary group-hover:text-primary" 
                      : "bg-white/5 border border-white/10 text-white group-hover:bg-primary group-hover:text-black group-hover:scale-105"
                  }`}>
                    {contact.avatar}
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 group-hover:text-white">{contact.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input placeholder="Recipient email, phone, or name" className="pl-10" id="p2p-recipient" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="p2p-amount" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Amount</label>
                  <Input type="number" placeholder="0.00" className="text-xl font-bold font-display" id="p2p-amount" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="p2p-from" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">From Account</label>
                  <select id="p2p-from" className="flex h-10 w-full rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>Checking (...4829)</option>
                    <option>Savings (...9921)</option>
                  </select>
                </div>
              </div>
              <Button className="w-full py-6 text-base font-bold">
                <Send className="mr-2 h-4 w-4" /> Send Payment
              </Button>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="border-b border-white/10 p-4 flex items-center justify-between">
              <h3 className="font-bold text-white">Recent P2P Activity</h3>
              <Button variant="ghost" className="text-xs text-slate-400 underline h-auto p-0">View all</Button>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { id: "tx1", name: "Dinner Split - Sarah", date: "Today", amount: "-$45.00", status: "Instant" },
                { id: "tx2", name: "Rent Reimbursement", date: "Yesterday", amount: "+$1,200.00", status: "Instant" },
                { id: "tx3", name: "Coffee - Mike", date: "Mar 12", amount: "-$6.50", status: "Instant" },
              ].map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{tx.name}</p>
                      <p className="text-[10px] text-slate-500">{tx.date} • {tx.status}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Zap className="h-5 w-5" />
              <h3 className="font-bold text-sm tracking-tight">Real-time Advantage</h3>
            </div>
            <p className="text-xs leading-5 text-slate-400">
              Your accounts support <span className="text-white font-medium">BlinkPay™</span> instant settlement. Transfers within the network or to Zelle® participants are final in seconds.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-bold text-sm tracking-tight">Transfer Protection</h3>
            </div>
            <p className="text-[10px] leading-5 text-slate-500">
              All transfers are monitored by AI-driven anti-fraud heuristics. Large or unusual payments may require biometric confirmation or a 24-hour review period for your safety.
            </p>
            <Button variant="secondary" className="w-full mt-4 h-9 text-[11px] font-bold">Manage Security</Button>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
