"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { formatCurrency } from "@/lib/utils";
import type { AccountRecord, SupportTicketRecord, UserProfile } from "@/lib/data/mock-bank-store";

export function BusinessWorkspace() {
  const { data: users } = useSuspenseQuery({
    queryKey: ["users", "business"],
    queryFn: () => apiRequest<UserProfile[]>("/api/users")
  });
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "business"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });
  const { data: tickets } = useSuspenseQuery({
    queryKey: ["support", "business"],
    queryFn: () => apiRequest<SupportTicketRecord[]>("/api/support")
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <SectionShell
      eyebrow="Business"
      title="Shared-account visibility and service operations for business banking teams"
      description="This workspace uses the live users, accounts, and support APIs to turn the business shell into a practical team operations surface."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Team members" value={String(users.length)} note="Profiles visible under the current tenant." />
        <MetricCard label="Shared accounts" value={String(accounts.length)} note="Accounts available to the business team." />
        <MetricCard label="Portfolio" value={formatCurrency(totalBalance)} note="Combined visible business balance base." />
        <MetricCard label="Open requests" value={String(tickets.filter((ticket) => ticket.status !== "closed").length)} note="Support items that may require operator action." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Team roster</h2>
          {users.map((user) => (
            <div key={user.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{user.fullName}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{user.role}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{user.email}</p>
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Account access</h2>
          {accounts.map((account) => (
            <div key={account.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{account.name}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{account.type}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{formatCurrency(account.balance)} currently visible to the team.</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
