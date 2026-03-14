"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { ComplianceRecord, PaymentRecord } from "@/lib/data/mock-bank-store";

const wireSchema = z.object({
  recipient: z.string().min(2),
  amount: z.number().positive()
});

type WireFormValues = z.infer<typeof wireSchema>;

export function WireWorkspace() {
  const queryClient = useQueryClient();
  const { data: payments } = useSuspenseQuery({
    queryKey: ["payments", "wire"],
    queryFn: () => apiRequest<PaymentRecord[]>("/api/payments")
  });
  const { data: compliance } = useSuspenseQuery({
    queryKey: ["compliance", "wire"],
    queryFn: () => apiRequest<ComplianceRecord[]>("/api/compliance")
  });

  const form = useForm<WireFormValues>({
    resolver: zodResolver(wireSchema),
    defaultValues: {
      recipient: "Vendor Settlement Desk",
      amount: 1200
    }
  });

  const mutation = useMutation({
    mutationFn: (values: WireFormValues) =>
      apiRequest<PaymentRecord>("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          recipient: values.recipient,
          amount: values.amount,
          channel: "wire"
        })
      }),
    onSuccess: () => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["payments"] });
      });
      form.reset();
    }
  });

  const wirePayments = payments.filter((payment) => payment.channel === "wire");

  return (
    <SectionShell
      eyebrow="Wire"
      title="Wire initiation with live payment queue visibility and compliance context"
      description="This workspace turns the wire shell into a real initiation surface using the live payments and compliance APIs already in place."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Wire count" value={String(wirePayments.length)} note="Wire payments visible in the live queue." />
        <MetricCard label="In review" value={String(compliance.filter((record) => record.status === "review").length)} note="Compliance items awaiting attention." />
        <MetricCard label="Blocked" value={String(compliance.filter((record) => record.status === "blocked").length)} note="Entries requiring intervention." />
        <MetricCard label="Cleared" value={String(compliance.filter((record) => record.status === "clear").length)} note="Compliance records ready to proceed." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Create a wire</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Recipient" {...form.register("recipient")} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" type="number" step="0.01" placeholder="Amount" {...form.register("amount", { valueAsNumber: true })} />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit wire"}
            </Button>
          </form>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Wire queue</h2>
          {wirePayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div>
                <p className="font-medium">{payment.recipient}</p>
                <p className="text-sm text-slate-400">{payment.status}</p>
              </div>
              <p className="font-semibold">{formatCurrency(payment.amount)}</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
