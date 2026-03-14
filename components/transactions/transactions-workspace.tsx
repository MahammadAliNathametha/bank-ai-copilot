"use client";

import { useDeferredValue, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { downloadCsv } from "@/lib/services/exports";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { TransactionRecord } from "@/lib/data/mock-bank-store";

const categories = ["All", "Food", "Income", "Utilities", "Credit", "Transfer"] as const;

export function TransactionsWorkspace() {
  useSupabaseRealtime(["transactions"]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const deferredSearch = useDeferredValue(search);

  const query = new URLSearchParams();
  if (deferredSearch) {
    query.set("search", deferredSearch);
  }
  if (category !== "All") {
    query.set("category", category);
  }

  const { data: transactions } = useSuspenseQuery({
    queryKey: ["transactions", deferredSearch, category],
    queryFn: () => apiRequest<TransactionRecord[]>(`/api/transactions${query.size ? `?${query.toString()}` : ""}`)
  });

  const outgoing = transactions.filter((item) => item.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0);

  function handleExportCsv() {
    downloadCsv("transactions-export.csv", transactions.map((transaction) => ({
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount,
      status: transaction.status,
      accountId: transaction.accountId,
      tenantId: transaction.tenantId
    })));
  }

  return (
    <SectionShell
      eyebrow="Transactions"
      title="Searchable transaction intelligence for every tenant ledger"
      description="This view consumes the transactions API with live search and category filtering while preserving tenant scope."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Visible rows" value={String(transactions.length)} note="Current filter result size." />
        <MetricCard label="Outgoing" value={formatCurrency(outgoing)} note="Total spend in the current filter set." />
        <MetricCard label="Status mix" value={`${transactions.filter((item) => item.status === "posted").length} posted`} note="Pending items stay explicit." />
      </div>
      <Card className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative group">
            <input
              className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="Search by description"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((item) => (
              <button
                key={item}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  category === item 
                    ? "bg-primary text-black shadow-[0_5px_15px_rgba(255,153,0,0.2)]" 
                    : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
            <Button type="button" variant="secondary" onClick={handleExportCsv} className="px-5">
              Export CSV
            </Button>
          </div>
        </div>
        <Table
          headers={["Date", "Description", "Category", "Amount", "Status"]}
          rows={transactions.map((transaction) => [
            transaction.date,
            transaction.description,
            transaction.category,
            formatCurrency(transaction.amount),
            transaction.status
          ])}
        />
      </Card>
    </SectionShell>
  );
}
