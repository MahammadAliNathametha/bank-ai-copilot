"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { AccountRecord, DocumentRecord, TransactionRecord } from "@/lib/data/mock-bank-store";

const checkDepositSchema = z.object({
  accountId: z.number().int().positive(),
  amount: z.number().positive()
});

type CheckDepositValues = z.infer<typeof checkDepositSchema>;

type CheckDepositResponse = {
  account: AccountRecord;
  analysis: {
    confidence: number;
    checkNumber: string;
    routingHint: string;
    payerName: string;
    manualReview: boolean;
    reason: string;
  };
  document: DocumentRecord;
  transaction: TransactionRecord;
};

export function CheckDepositWorkspace() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("Register a check image, credit the selected account, and record the deposit transaction.");
  const [analysisSummary, setAnalysisSummary] = useState<CheckDepositResponse["analysis"] | null>(null);

  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "checkdeposit"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });
  const { data: documents } = useSuspenseQuery({
    queryKey: ["documents", "checkdeposit"],
    queryFn: () => apiRequest<DocumentRecord[]>("/api/documents")
  });
  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "checkdeposit"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });

  const form = useForm<CheckDepositValues>({
    resolver: zodResolver(checkDepositSchema),
    defaultValues: {
      accountId: accounts[0]?.id ?? 101,
      amount: 125
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: CheckDepositValues) => {
      if (!selectedFile) {
        throw new Error("Check image is required");
      }

      const formData = new FormData();
      formData.set("accountId", String(values.accountId));
      formData.set("amount", String(values.amount));
      formData.set("file", selectedFile);

      return apiRequest<CheckDepositResponse>("/api/checkdeposit", {
        method: "POST",
        body: formData
      });
    },
    onSuccess: (result) => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["accounts"] });
        void queryClient.invalidateQueries({ queryKey: ["documents"] });
        void queryClient.invalidateQueries({ queryKey: ["transactions"] });
      });
      setAnalysisSummary(result.analysis);
      setStatusMessage(
        result.analysis.manualReview
          ? `Deposit submitted for review. ${result.analysis.reason}`
          : `Deposited funds into ${result.account.name}. Updated balance: ${formatCurrency(result.account.balance)}.`
      );
      form.reset({
        accountId: result.account.id,
        amount: 125
      });
      setSelectedFile(null);
    }
  });

  const depositTransactions = transactions.filter((transaction) => transaction.category.toLowerCase() === "deposit");
  const checkImages = documents.filter((document) => document.type.toLowerCase().includes("check"));

  return (
    <SectionShell
      eyebrow="Check Deposit"
      title="Mobile deposit flow built from live documents, transactions, and account updates"
      description="This page replaces the shell with a practical deposit workflow using the APIs already present in the product surface."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Deposit entries" value={String(depositTransactions.length)} note="Transactions categorized as deposits." />
        <MetricCard label="Check images" value={String(checkImages.length)} note="Registered deposit documents." />
        <MetricCard label="Accounts" value={String(accounts.length)} note="Eligible deposit destinations." />
        <MetricCard label="Flow state" value={analysisSummary?.manualReview ? "Review" : "Live"} note="OCR simulation now gates automatic release." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Submit a deposit</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("accountId", { valueAsNumber: true })}>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} · {formatCurrency(account.balance)}
                </option>
              ))}
            </select>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" type="number" step="0.01" placeholder="Amount" {...form.register("amount", { valueAsNumber: true })} />
            <input
              className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.pdf"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Depositing..." : "Submit deposit"}
            </Button>
          </form>
          <p className="text-sm text-slate-400">{statusMessage}</p>
          {analysisSummary ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-slate-400">
              <p className="font-semibold text-white">Latest OCR simulation</p>
              <p className="mt-2">Payer: {analysisSummary.payerName}</p>
              <p>Confidence: {Math.round(analysisSummary.confidence * 100)}%</p>
              <p>Check #: {analysisSummary.checkNumber}</p>
              <p>Routing hint: {analysisSummary.routingHint}</p>
              <p className="mt-2">{analysisSummary.reason}</p>
            </div>
          ) : null}
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Recent deposit artifacts</h2>
          {checkImages.map((document) => (
            <div key={document.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{document.type}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{document.status}</span>
              </div>
              <p className="mt-2 break-all text-sm text-slate-400">{document.url}</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
