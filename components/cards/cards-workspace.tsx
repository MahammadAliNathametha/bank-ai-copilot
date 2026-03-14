"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { cardCreateSchema } from "@/lib/validations/banking";
import type { CardRecord, NotificationRecord } from "@/lib/data/mock-bank-store";

type CardFormValues = z.infer<typeof cardCreateSchema>;

export function CardsWorkspace() {
  const queryClient = useQueryClient();
  const { data: cards } = useSuspenseQuery({
    queryKey: ["cards", "workspace"],
    queryFn: () => apiRequest<CardRecord[]>("/api/cards")
  });
  const { data: notifications } = useSuspenseQuery({
    queryKey: ["notifications", "cards"],
    queryFn: () => apiRequest<NotificationRecord[]>("/api/notifications")
  });

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardCreateSchema),
    defaultValues: {
      userId: "11111111-1111-1111-1111-111111111112",
      last4: "4242",
      status: "inactive",
      alertsEnabled: true
    }
  });

  const mutation = useMutation({
    mutationFn: (values: CardFormValues) =>
      apiRequest<CardRecord>("/api/cards", {
        method: "POST",
        body: JSON.stringify(values)
      }),
    onSuccess: () => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["cards"] });
      });
      form.reset();
    }
  });

  return (
    <SectionShell
      eyebrow="Cards"
      title="Card controls, issuance state, and alert coverage on the live tenant ledger"
      description="This workspace now reads and writes through the cards API while surfacing the alert footprint already configured for the tenant."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Card count" value={String(cards.length)} note="Visible issued cards." />
        <MetricCard label="Active cards" value={String(cards.filter((card) => card.status === "active").length)} note="Cards ready for spending." />
        <MetricCard label="Locked cards" value={String(cards.filter((card) => card.status === "locked").length)} note="Cards under temporary lock." />
        <MetricCard label="Alert rules" value={String(notifications.filter((item) => item.status === "active").length)} note="Notifications supporting card monitoring." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Issue a card</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="User id" {...form.register("userId")} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Last 4 digits" maxLength={4} {...form.register("last4")} />
            <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("status")}>
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
              <option value="locked">Locked</option>
            </select>
            <label className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-300">
              <input type="checkbox" {...form.register("alertsEnabled")} />
              Enable alerts
            </label>
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Issuing..." : "Create card"}
            </Button>
          </form>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Card controls</h2>
          {cards.map((card) => (
            <div key={card.id} className="rounded-2xl bg-white/5 border border-white/10 px-5 py-5 group hover:border-white/20 transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-[10px] text-white/50 tracking-tighter">
                    VISA
                  </div>
                  <div>
                    <p className="font-bold text-white uppercase tracking-wider">•••• {card.last4}</p>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">{card.status}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-white/20 transition-colors uppercase tracking-widest">
                    Freeze
                  </button>
                  <button className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-white/20 transition-colors uppercase tracking-widest">
                    Limits
                  </button>
                </div>
              </div>
              
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 rounded-xl bg-black border border-white/10 py-2.5 hover:bg-white/5 transition-all group/wallet">
                  <div className="h-4 w-4 rounded-full bg-white flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-black" />
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Add to Apple Wallet</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl bg-[#1a73e810] border border-[#1a73e830] py-2.5 hover:bg-[#1a73e820] transition-all group/google">
                  <div className="flex gap-px">
                     <div className="h-1 w-1 bg-red-500" />
                     <div className="h-1 w-1 bg-blue-500" />
                     <div className="h-1 w-1 bg-yellow-500" />
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Add to GPay</span>
                </button>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
