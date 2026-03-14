"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import { loanPaymentSchema } from "@/lib/validations/banking";
import type { LoanRecord } from "@/lib/data/mock-bank-store";

type LoanPaymentValues = z.infer<typeof loanPaymentSchema>;

export function LoansWorkspace() {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState("Apply a payment to the live loan ledger for this tenant.");
  const { data: loans } = useSuspenseQuery({
    queryKey: ["loans"],
    queryFn: () => apiRequest<LoanRecord[]>("/api/loans")
  });

  const form = useForm<LoanPaymentValues>({
    resolver: zodResolver(loanPaymentSchema),
    defaultValues: {
      id: loans[0]?.id ?? 101,
      amount: loans[0]?.nextPayment ?? 250
    }
  });

  const mutation = useMutation({
    mutationFn: (values: LoanPaymentValues) =>
      apiRequest<LoanRecord>("/api/loans?action=pay", {
        method: "POST",
        body: JSON.stringify(values)
      }),
    onSuccess: (loan) => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["loans"] });
      });
      setStatusMessage(`Loan #${loan.id} updated. Remaining balance: ${formatCurrency(loan.balance)}.`);
    }
  });

  const totalBalance = loans.reduce((sum, loan) => sum + loan.balance, 0);

  return (
    <SectionShell
      eyebrow="Loans"
      title="Loan balances, next payments, and payoff actions tied to the live tenant ledger"
      description="This page now uses the live loans API for account-level debt visibility and payment actions."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Loan count" value={String(loans.length)} note="Active loan products for this tenant." />
        <MetricCard label="Outstanding" value={formatCurrency(totalBalance)} note="Total principal remaining." />
        <MetricCard label="Next due" value={formatCurrency(loans.reduce((sum, loan) => sum + loan.nextPayment, 0))} note="Scheduled upcoming payment volume." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Apply a payment</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("id", { valueAsNumber: true })}>
              {loans.map((loan) => (
                <option key={loan.id} value={loan.id}>
                  {loan.type} · {formatCurrency(loan.balance)}
                </option>
              ))}
            </select>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" type="number" step="0.01" placeholder="Payment amount" {...form.register("amount", { valueAsNumber: true })} />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Applying..." : "Apply payment"}
            </Button>
          </form>
          <p className="text-sm text-slate-400">{statusMessage}</p>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Loan ledger</h2>
          {loans.map((loan) => (
            <div key={loan.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{loan.type}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{formatCurrency(loan.nextPayment)} next</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Outstanding balance: {formatCurrency(loan.balance)}</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
