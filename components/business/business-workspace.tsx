"use client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useMemo } from "react";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { accountMemberCreateSchema } from "@/lib/validations/banking";
import { formatCurrency } from "@/lib/utils";
import type { AccountMemberRecord, AccountRecord, SupportTicketRecord, UserProfile } from "@/lib/data/mock-bank-store";

export function BusinessWorkspace() {
  const queryClient = useQueryClient();
  const { data: users } = useSuspenseQuery({
    queryKey: ["users", "business"],
    queryFn: () => apiRequest<UserProfile[]>("/api/users")
  });
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "business"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });
  const { data: members } = useSuspenseQuery({
    queryKey: ["account-members"],
    queryFn: () => apiRequest<AccountMemberRecord[]>("/api/account-members")
  });
  const { data: tickets } = useSuspenseQuery({
    queryKey: ["support", "business"],
    queryFn: () => apiRequest<SupportTicketRecord[]>("/api/support")
  });

  const membershipRows = useMemo(() => {
    return members.map((member) => {
      const user = users.find((entry) => entry.id === member.userId);
      const account = accounts.find((entry) => entry.id === member.accountId);
      return {
        id: member.id,
        userName: user?.fullName ?? member.userId,
        role: member.role,
        accountName: account?.name ?? `Account ${member.accountId}`
      };
    });
  }, [members, users, accounts]);

  const mutation = useMutation({
    mutationFn: (payload: { accountId: number; userId: string; role: "owner" | "editor" | "viewer" }) =>
      apiRequest<AccountMemberRecord>("/api/account-members", {
        method: "POST",
        body: JSON.stringify(payload)
      }),
    onSuccess: () => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["account-members"] });
      });
    }
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
          {membershipRows.map((member) => (
            <div key={member.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{member.userName}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{member.role}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{member.accountName}</p>
            </div>
          ))}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-sm font-semibold text-slate-300">Grant access</h3>
            <form
              className="mt-3 grid gap-3 md:grid-cols-3"
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget as HTMLFormElement;
                const formData = new FormData(form);
                const payload = accountMemberCreateSchema.parse({
                  accountId: Number(formData.get("accountId")),
                  userId: String(formData.get("userId")),
                  role: String(formData.get("role"))
                });
                mutation.mutate(payload);
                form.reset();
              }}
            >
              <select name="accountId" className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white">
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
              <select name="userId" className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white">
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.fullName}</option>
                ))}
              </select>
              <select name="role" className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white">
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="owner">Owner</option>
              </select>
              <button className="md:col-span-3 rounded-2xl bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black" type="submit">
                Add member
              </button>
            </form>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
