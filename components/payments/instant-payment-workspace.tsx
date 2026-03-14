"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Zap, ArrowRight, ShieldCheck, Clock, 
  CheckCircle2
} from "lucide-react";

import { SectionShell } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/services/http";
import type { BeneficiaryRecord } from "@/lib/data/mock-bank-store";

export function InstantPaymentWorkspace() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedRail, setSelectedRail] = useState<"fednow" | "rtp">("fednow");
  const [paymentData, setPaymentData] = useState({
    beneficiaryId: "",
    amount: ""
  });

  const { data: beneficiaries } = useSuspenseQuery({
    queryKey: ["beneficiaries"],
    queryFn: () => apiRequest<BeneficiaryRecord[]>("/api/beneficiaries")
  });

  const sendMutation = useMutation({
    mutationFn: (data: { beneficiaryId: string; amount: string }) => {
      const beneficiary = beneficiaries.find((entry) => entry.id === Number.parseInt(data.beneficiaryId));
      return apiRequest("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          recipient: beneficiary?.name ?? "External Beneficiary",
          amount: Number.parseFloat(data.amount),
          channel: "wire"
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setStep(3);
    }
  });

  const handleSend = () => {
    sendMutation.mutate(paymentData);
  };

  return (
    <SectionShell
      eyebrow="Payments"
      title="Instant Payments (FedNow & RTP)"
      description="Send money instantly, 24/7/365, using the latest real-time payment rails. Settlement happens in seconds."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <Card className="space-y-6">
              <h2 className="font-display text-2xl">Configure Instant Payment</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                <button 
                  onClick={() => setSelectedRail("fednow")}
                  className={`relative flex flex-col items-start gap-3 rounded-2xl border p-5 transition-all ${
                    selectedRail === "fednow" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className={`rounded-xl p-2 ${selectedRail === "fednow" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">FedNow</p>
                    <p className="text-xs text-slate-500">Instant settlement via Federal Reserve</p>
                  </div>
                  {selectedRail === "fednow" && <CheckCircle2 className="absolute top-4 right-4 h-4 w-4 text-primary" />}
                </button>

                <button 
                  onClick={() => setSelectedRail("rtp")}
                  className={`relative flex flex-col items-start gap-3 rounded-2xl border p-5 transition-all ${
                    selectedRail === "rtp" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className={`rounded-xl p-2 ${selectedRail === "rtp" ? "bg-primary text-black" : "bg-white/10 text-white"}`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">RTP® Network</p>
                    <p className="text-xs text-slate-500">Real-Time Payments via The Clearing House</p>
                  </div>
                  {selectedRail === "rtp" && <CheckCircle2 className="absolute top-4 right-4 h-4 w-4 text-primary" />}
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-1.5">
                  <label htmlFor="beneficiary" className="text-xs font-bold text-slate-500 uppercase tracking-wider">To Beneficiary</label>
                  <select 
                    id="beneficiary"
                    value={paymentData.beneficiaryId}
                    onChange={(e) => setPaymentData({ ...paymentData, beneficiaryId: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-white focus:border-primary/50 focus:outline-none"
                  >
                    <option value="">Select a beneficiary</option>
                    {beneficiaries.map(ben => (
                      <option key={ben.id} value={ben.id}>{ben.name} ({ben.accountNumber})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="amount" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-xl text-slate-500">$</span>
                    <input 
                      id="amount"
                      type="number" 
                      placeholder="0.00"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-4 pl-10 text-2xl font-display text-white placeholder:text-slate-700 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full h-14 text-lg gap-2" 
                  onClick={() => setStep(2)}
                  disabled={!paymentData.amount || !paymentData.beneficiaryId}
                >
                  Review Instant Transfer
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl">Confirm Payment</h2>
                <p className="text-sm text-slate-400">Please review the details below. This payment is irrevocable and final once sent.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10 overflow-hidden">
                <div className="flex justify-between p-4">
                  <span className="text-slate-500">Total Amount</span>
                  <span className="text-xl font-display text-white">${Number.parseFloat(paymentData.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-slate-500">Method</span>
                  <span className="font-bold text-primary italic uppercase tracking-wider">{selectedRail} Instant</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-slate-500">Beneficiary</span>
                  <span className="text-white font-medium">{beneficiaries.find(b => b.id === Number.parseInt(paymentData.beneficiaryId))?.name}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-slate-500">Fee</span>
                  <span className="text-emerald-400 font-bold">$0.00 (Standard)</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button 
                  className="flex-1 h-12 gap-2" 
                  onClick={handleSend}
                  disabled={sendMutation.isPending}
                >
                  {sendMutation.isPending ? "Processing..." : "Authorize & Send Now"}
                  <Zap className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest leading-relaxed">
                Settlement guaranteed by {selectedRail === "fednow" ? "Federal Reserve" : "The Clearing House"}.
              </p>
            </Card>
          )}

          {step === 3 && (
            <Card className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-black">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="font-display text-3xl">Payment Delivered!</h2>
                <p className="text-slate-400 max-w-xs mx-auto">
                  Your ${Number.parseFloat(paymentData.amount).toLocaleString()} payment via {selectedRail.toUpperCase()} has been successfully settled with the beneficiary&apos;s bank.
                </p>
              </div>
              <Button onClick={() => { setStep(1); setPaymentData({ ...paymentData, amount: "" }); }} variant="ghost">
                Send Another Payment
              </Button>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Why Instant?
            </h3>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Funds available to recipient in seconds, not days.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Operates 24/7, including weekends and holidays.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Irrevocable settlement removes payment risk.</span>
              </li>
            </ul>
          </Card>

          <Card className="space-y-4">
            <h3 className="font-bold text-white">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">FedNow Service</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">RTP Network</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Operational
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden group">
            <div className="p-4 bg-white/5 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Activity</p>
              <Zap className="h-3 w-3 text-slate-700 group-hover:text-primary transition-colors" />
            </div>
            <div className="p-4 space-y-4">
              <p className="text-[10px] text-slate-600 text-center italic">No instant payments in the last 24 hours.</p>
            </div>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
