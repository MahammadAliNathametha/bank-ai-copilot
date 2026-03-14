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
import { formatCurrency } from "@/lib/utils";
import { paymentCreateSchema } from "@/lib/validations/banking";
import type { PaymentRecord } from "@/lib/data/mock-bank-store";

type PaymentFormValues = z.infer<typeof paymentCreateSchema>;

export function P2PWorkspace() {
  const queryClient = useQueryClient();
  const { data: payments } = useSuspenseQuery({
    queryKey: ["payments", "p2p"],
    queryFn: () => apiRequest<PaymentRecord[]>("/api/payments")
  });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentCreateSchema),
    defaultValues: {
      recipient: "Alex Doe",
      amount: 45,
      channel: "p2p"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: PaymentFormValues) =>
      apiRequest<PaymentRecord>("/api/payments", {
        method: "POST",
        body: JSON.stringify(values)
      }),
    onSuccess: () => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["payments"] });
      });
      form.reset({
        recipient: "Alex Doe",
        amount: 45,
        channel: "p2p"
      });
    }
  });

  const totalProcessing = payments.filter((payment) => payment.status === "processing").reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <SectionShell
      eyebrow="P2P"
      title="Send money through the live payments rail with a tenant-scoped transfer queue"
      description="The page now uses the payments API for person-to-person transfers and keeps status visibility in the same tenant boundary."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Payments" value={String(payments.length)} note="Recorded P2P and wire entries." />
        <MetricCard label="Processing" value={formatCurrency(totalProcessing)} note="Amount currently in-flight." />
        <MetricCard label="Completed" value={String(payments.filter((payment) => payment.status === "completed").length)} note="Payments that have settled." />
        <MetricCard label="Recipients" value={String(new Set(payments.map((payment) => payment.recipient)).size)} note="Distinct destinations reached." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Send a payment</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Recipient" {...form.register("recipient")} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" type="number" step="0.01" placeholder="Amount" {...form.register("amount", { valueAsNumber: true })} />
            <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("channel")}>
              <option value="p2p">P2P</option>
              <option value="wire">Wire</option>
            </select>
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Sending..." : "Send payment"}
            </Button>
          </form>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Payment queue</h2>
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div>
                <p className="font-medium">{payment.recipient}</p>
                <p className="text-sm text-slate-400">{payment.channel.toUpperCase()} · {payment.status}</p>
              </div>
              <p className="font-semibold">{formatCurrency(payment.amount)}</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
