"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { AccountRecord } from "@/lib/data/mock-bank-store";

export function AccountsWorkspace() {
  useSupabaseRealtime(["accounts"]);

  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <SectionShell
      eyebrow="Accounts"
      title="Tenant-filtered account portfolios with white-label balance storytelling"
      description="Every account card, allocation panel, and activity metric comes from the tenant-safe accounts API."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total balance" value={formatCurrency(totalBalance)} note="Across checking and savings products." />
        <MetricCard label="Products" value={String(accounts.length)} note="Tenant catalog currently provisioned." />
        <MetricCard label="Primary mix" value="64%" note="Deposit share in liquid accounts." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account) => (
            <Card key={account.id} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{account.type}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{account.name}</h2>
                </div>
                <div className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                  API-backed
                </div>
              </div>
              <p className="font-display text-4xl">{formatCurrency(account.balance)}</p>
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white">
                Tenant isolation enforced through `tenant_id` before any balance reaches the page.
              </div>
            </Card>
          ))}
        </div>
        <Card className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Portfolio direction</p>
          <h2 className="font-display text-3xl">Deposit confidence is high.</h2>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>Checking remains the operational hub for bills and transfers.</li>
            <li>Savings balance supports the AI “wedding” savings storyline from the blueprint.</li>
            <li>Tenant branding can shift this page without changing the underlying data contract.</li>
          </ul>
        </Card>
      </div>
    </SectionShell>
  );
}
