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
import { notificationCreateSchema } from "@/lib/validations/banking";
import type { CardRecord, NotificationRecord, TransactionRecord } from "@/lib/data/mock-bank-store";

type AlertFormValues = z.infer<typeof notificationCreateSchema>;

export function AlertsWorkspace() {
  const queryClient = useQueryClient();
  const { data: notifications } = useSuspenseQuery({
    queryKey: ["notifications", "alerts"],
    queryFn: () => apiRequest<NotificationRecord[]>("/api/notifications")
  });
  const { data: cards } = useSuspenseQuery({
    queryKey: ["cards", "alerts"],
    queryFn: () => apiRequest<CardRecord[]>("/api/cards")
  });
  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "alerts"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(notificationCreateSchema),
    defaultValues: {
      userId: "11111111-1111-1111-1111-111111111112",
      message: "Notify me when a transfer exceeds $500",
      channel: "push",
      status: "active"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: AlertFormValues) =>
      apiRequest<NotificationRecord>("/api/notifications", {
        method: "POST",
        body: JSON.stringify(values)
      }),
    onSuccess: () => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
      form.reset();
    }
  });

  const activeAlerts = notifications.filter((notification) => notification.status === "active").length;
  const flaggedSpend = transactions.filter((transaction) => transaction.amount < -100).length;

  return (
    <SectionShell
      eyebrow="Alerts"
      title="Delivery rules, card coverage, and event awareness in one alert center"
      description="Alert preferences now flow through the live notifications API while cards and transaction volume provide context for monitoring coverage."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Active alerts" value={String(activeAlerts)} note="Notification rules currently enabled." />
        <MetricCard label="Cards covered" value={String(cards.length)} note="Card-level protection in scope." />
        <MetricCard label="High-value events" value={String(flaggedSpend)} note="Transactions over the alert threshold." />
        <MetricCard label="Channels" value={String(new Set(notifications.map((item) => item.channel)).size)} note="Distinct delivery methods configured." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Create an alert rule</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="User id" {...form.register("userId")} />
            <textarea className="min-h-28 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm" placeholder="Alert message" {...form.register("message")} />
            <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("channel")}>
              <option value="push">Push</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save alert"}
            </Button>
          </form>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Configured rules</h2>
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{notification.channel.toUpperCase()}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{notification.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{notification.message}</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
