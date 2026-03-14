"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { downloadPdf } from "@/lib/services/exports";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { DocumentRecord, TransactionRecord } from "@/lib/data/mock-bank-store";

export function TaxWorkspace() {
  const { data: documents } = useSuspenseQuery({
    queryKey: ["documents", "tax"],
    queryFn: () => apiRequest<DocumentRecord[]>("/api/documents")
  });
  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "tax"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });

  const incomeTransactions = transactions.filter((transaction) => transaction.amount > 0);
  const taxableIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const statementDocs = documents.filter((document) => document.type.toLowerCase().includes("statement"));

  function handleExportPdf() {
    downloadPdf({
      title: "Tax preparation summary",
      filename: "tax-summary.pdf",
      subtitle: "Generated from the live tenant deposit history and statement archive.",
      metrics: [
        { label: "Income rows", value: String(incomeTransactions.length) },
        { label: "Taxable flow", value: formatCurrency(taxableIncome) },
        { label: "Statement docs", value: String(statementDocs.length) },
        { label: "Pending docs", value: String(documents.filter((document) => document.status !== "ready").length) }
      ],
      rows: incomeTransactions.map((transaction) => ({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: formatCurrency(transaction.amount),
        status: transaction.status
      })),
      notes: statementDocs.map((document) => `${document.type} - ${document.status} - ${document.url}`)
    });
  }

  return (
    <SectionShell
      eyebrow="Tax"
      title="Tax-ready income and document review for the active tenant"
      description="This workspace reuses the live documents and transactions feeds to turn the tax shell into a practical year-end readiness surface."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Income rows" value={String(incomeTransactions.length)} note="Positive ledger entries relevant to tax prep." />
        <MetricCard label="Taxable flow" value={formatCurrency(taxableIncome)} note="Current tracked incoming amount." />
        <MetricCard label="Statement docs" value={String(statementDocs.length)} note="Archived documents available for review." />
        <MetricCard label="Pending docs" value={String(documents.filter((document) => document.status !== "ready").length)} note="Items not yet ready for download." />
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="secondary" onClick={handleExportPdf}>
          Download Tax PDF
        </Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Income trace</p>
            <h2 className="mt-2 font-display text-3xl">Deposit history</h2>
          </div>
          <Table
            headers={["Date", "Description", "Category", "Amount", "Status"]}
            rows={incomeTransactions.map((transaction) => [
              transaction.date,
              transaction.description,
              transaction.category,
              formatCurrency(transaction.amount),
              transaction.status
            ])}
          />
        </Card>
        <Card className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Reference docs</p>
            <h2 className="mt-2 font-display text-3xl">Available statements</h2>
          </div>
          {statementDocs.length === 0 ? (
            <p className="text-sm text-slate-400">No tax-related documents are ready yet.</p>
          ) : (
            statementDocs.map((document) => (
              <div key={document.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{document.type}</p>
                  <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{document.status}</span>
                </div>
                <p className="mt-2 break-all text-sm text-slate-400">{document.url}</p>
              </div>
            ))
          )}
        </Card>
      </div>
    </SectionShell>
  );
}
