"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition } from "react";
import { useForm } from "react-hook-form";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import { billCreateSchema } from "@/lib/validations/banking";
import type { BillRecord } from "@/lib/data/mock-bank-store";
import type { z } from "zod";

type BillFormValues = z.infer<typeof billCreateSchema>;

export function BillsWorkspace() {
  const queryClient = useQueryClient();
  const { data: bills } = useSuspenseQuery({
    queryKey: ["bills"],
    queryFn: () => apiRequest<BillRecord[]>("/api/bills")
  });

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billCreateSchema),
    defaultValues: {
      payeeId: 2,
      payeeName: "Water Utility",
      amount: 89.44,
      schedule: "monthly",
      status: "scheduled"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: BillFormValues) =>
      apiRequest<BillRecord>("/api/bills", {
        method: "POST",
        body: JSON.stringify(values)
      }),
    onSuccess: () => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["bills"] });
      });
      form.reset();
    }
  });

  return (
    <SectionShell
      eyebrow="Bill Pay"
      title="Payees, schedules, and bill operations for the active tenant"
      description="The bill pay page turns the tenant-safe bills API into a practical scheduling workspace."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Scheduled bills" value={String(bills.length)} note="Payments queued in the current tenant." />
        <MetricCard label="Upcoming outflow" value={formatCurrency(bills.reduce((sum, bill) => sum + bill.amount, 0))} note="Projected bill amount." />
        <MetricCard label="Automation" value="On" note="Recurring schedules can be shaped per institution." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Schedule a payment</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Payee name" {...form.register("payeeName")} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" type="number" placeholder="Payee id" {...form.register("payeeId", { valueAsNumber: true })} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" type="number" step="0.01" placeholder="Amount" {...form.register("amount", { valueAsNumber: true })} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Schedule" {...form.register("schedule")} />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save bill"}
            </Button>
          </form>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Tenant bill queue</h2>
          {bills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <div>
                <p className="font-medium">{bill.payeeName}</p>
                <p className="text-sm text-slate-400">{bill.schedule} · {bill.status}</p>
              </div>
              <p className="font-semibold">{formatCurrency(bill.amount)}</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
