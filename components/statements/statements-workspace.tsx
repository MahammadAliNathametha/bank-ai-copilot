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

export function StatementsWorkspace() {
  const { data: documents } = useSuspenseQuery({
    queryKey: ["documents", "statements"],
    queryFn: () => apiRequest<DocumentRecord[]>("/api/documents")
  });
  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", "statements"],
    queryFn: () => apiRequest<TransactionRecord[]>("/api/transactions")
  });

  const statementDocs = documents.filter((document) => document.type.toLowerCase().includes("statement"));
  const outgoing = transactions.filter((item) => item.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const incoming = transactions.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);

  function handleExportPdf() {
    downloadPdf({
      title: "Tenant statement snapshot",
      filename: "statement-snapshot.pdf",
      subtitle: "Generated from the live documents and transactions views for the current tenant.",
      metrics: [
        { label: "Statement docs", value: String(statementDocs.length) },
        { label: "Entries", value: String(transactions.length) },
        { label: "Incoming", value: formatCurrency(incoming) },
        { label: "Outgoing", value: formatCurrency(outgoing) }
      ],
      rows: transactions.slice(0, 12).map((transaction) => ({
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
      eyebrow="Statements"
      title="Statement archive and transaction snapshot drawn from the live tenant history"
      description="This workspace reuses the documents and transactions APIs to give operators and members a live-backed statement center before PDF generation is added."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Statement docs" value={String(statementDocs.length)} note="Archived statement-like documents." />
        <MetricCard label="Entries" value={String(transactions.length)} note="Transaction rows visible in the current history." />
        <MetricCard label="Incoming" value={formatCurrency(incoming)} note="Positive movement in the period." />
        <MetricCard label="Outgoing" value={formatCurrency(outgoing)} note="Spend and outflows in the period." />
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="secondary" onClick={handleExportPdf}>
          Download PDF
        </Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Archive</p>
            <h2 className="mt-2 font-display text-3xl">Available statements</h2>
          </div>
          {statementDocs.length === 0 ? (
            <p className="text-sm text-slate-400">No statement documents available yet.</p>
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
        <Card className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Live ledger snapshot</p>
            <h2 className="mt-2 font-display text-3xl">Statement activity</h2>
          </div>
          <Table
            headers={["Date", "Description", "Category", "Amount", "Status"]}
            rows={transactions.slice(0, 8).map((transaction) => [
              transaction.date,
              transaction.description,
              transaction.category,
              formatCurrency(transaction.amount),
              transaction.status
            ])}
          />
        </Card>
      </div>
    </SectionShell>
  );
}
