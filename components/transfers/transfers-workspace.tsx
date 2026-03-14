"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import { transferSchema, type TransferInput } from "@/lib/validations/banking";
import type { AccountRecord, TransferRecord } from "@/lib/data/mock-bank-store";

export function TransfersWorkspace() {
  useSupabaseRealtime(["accounts", "transactions", "transfers", "insights"]);

  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState("Use internal transfers to shift money between tenant-approved accounts.");

  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });

  const { data: transfers } = useSuspenseQuery({
    queryKey: ["transfers"],
    queryFn: () => apiRequest<TransferRecord[]>("/api/transfers")
  });

  const form = useForm<TransferInput>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromId: accounts[0]?.id ?? 1,
      toId: accounts[1]?.id ?? 2,
      amount: 125,
      method: "internal"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: TransferInput) =>
      apiRequest<TransferRecord>("/api/transfers", {
        method: "POST",
        body: JSON.stringify(values)
      }),
    onSuccess: (transfer) => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["accounts"] });
        void queryClient.invalidateQueries({ queryKey: ["transfers"] });
        void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      });
      setStatusMessage(`Transfer #${transfer.id} completed successfully.`);
      form.reset({
        ...form.getValues(),
        amount: 125
      });
    }
  });

  const totalMoved = transfers.reduce((sum, transfer) => sum + transfer.amount, 0);

  return (
    <SectionShell
      eyebrow="Transfers"
      title="Move money with tenant-safe validation and balance-aware feedback"
      description="The transfer form posts to the existing tenant-safe API and refreshes account summaries after success."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Accounts" value={String(accounts.length)} note="Eligible origin and destination accounts." />
        <MetricCard label="Transfers" value={String(transfers.length)} note="Completed tenant transfer records." />
        <MetricCard label="Moved" value={formatCurrency(totalMoved)} note="Aggregate transferred amount in this demo tenant." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Initiate transfer</p>
            <h2 className="mt-2 font-display text-3xl">Internal and ACH-ready form</h2>
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">From account</span>
              <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("fromId", { valueAsNumber: true })}>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} · {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">To account</span>
              <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("toId", { valueAsNumber: true })}>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Amount</span>
              <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" type="number" step="0.01" {...form.register("amount", { valueAsNumber: true })} />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Method</span>
              <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("method")}>
                <option value="internal">Internal</option>
                <option value="external">External</option>
                <option value="ach">ACH</option>
              </select>
            </label>
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit transfer"}
            </Button>
          </form>
          <p className="text-sm text-slate-400">{statusMessage}</p>
        </Card>
        <Card className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Recent activity</p>
          <div className="space-y-3">
            {transfers.length === 0 ? (
              <p className="text-sm text-slate-400">No transfers recorded yet for this tenant.</p>
            ) : (
              transfers.map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                  <div>
                    <p className="font-medium">Transfer #{transfer.id}</p>
                    <p className="text-sm text-slate-400">{transfer.method.toUpperCase()} · {transfer.status}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(transfer.amount)}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
