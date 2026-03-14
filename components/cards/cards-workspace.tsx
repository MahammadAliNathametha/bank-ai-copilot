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
            <div key={card.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">Card ending in {card.last4}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{card.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Alerts {card.alertsEnabled ? "enabled" : "disabled"} for this card.</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
