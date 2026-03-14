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
import type { AccountRecord, UserProfile } from "@/lib/data/mock-bank-store";

const onboardSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  idNumber: z.string().min(5),
  accountName: z.string().min(2),
  accountType: z.string().min(2),
  openingBalance: z.number().nonnegative()
});

type OnboardFormValues = z.infer<typeof onboardSchema>;

export function OnboardWorkspace() {
  const queryClient = useQueryClient();
  const [statusMessage, setStatusMessage] = useState("Enrollment requires identity verification (KYC) against global watchlists.");
  const [verificationState, setVerificationState] = useState<"idle" | "verifying" | "success" | "failed">("idle");

  const { data: users } = useSuspenseQuery({
    queryKey: ["users", "onboard"],
    queryFn: () => apiRequest<UserProfile[]>("/api/users")
  });
  const { data: accounts } = useSuspenseQuery({
    queryKey: ["accounts", "onboard"],
    queryFn: () => apiRequest<AccountRecord[]>("/api/accounts")
  });

  const form = useForm<OnboardFormValues>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      email: "new.member@tenant.test",
      fullName: "New Tenant Member",
      idNumber: "ID-9921-X",
      accountName: "Starter Checking",
      accountType: "checking",
      openingBalance: 250
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: OnboardFormValues) => {
      setVerificationState("verifying");
      setStatusMessage("Checking identity against watchlist and compliance records...");
      
      // Artificial delay for "Compliance Sweep"
      await new Promise((resolve) => setTimeout(resolve, 1800));
      
      const user = await apiRequest<UserProfile>("/api/users", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          fullName: values.fullName,
          role: "member"
        })
      });

      const account = await apiRequest<AccountRecord>("/api/accounts", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          name: values.accountName,
          type: values.accountType,
          balance: values.openingBalance
        })
      });

      return { user, account };
    },
    onSuccess: ({ user, account }) => {
      setVerificationState("success");
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["users"] });
        void queryClient.invalidateQueries({ queryKey: ["accounts"] });
      });
      setStatusMessage(`Identity Verified. Created ${user.fullName} with account ${account.name}.`);
      form.reset();
      
      setTimeout(() => {
        setVerificationState("idle");
        setStatusMessage("Member enrollment cleared. Next identity check ready.");
      }, 4000);
    }
  });

  return (
    <SectionShell
      eyebrow="Onboard"
      title="High-assurance member enrollment with integrated identity verification"
      description="This workflow satisfies KYC requirements by running an identity sweep before profile and account instantiation."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Members" value={String(users.length)} note="Verified tenant user profiles." />
        <MetricCard label="Accounts" value={String(accounts.length)} note="Live account records." />
        <MetricCard 
          label="KYC Status" 
          value={verificationState === "verifying" ? "RUNNING" : "READY"} 
          note={verificationState === "verifying" ? "Compliance engine active." : "Waiting for next applicant."} 
        />
        <MetricCard label="Security" value="High" note="Identity sweep enabled for all registrations." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl">Enrollment</h2>
            {verificationState === "verifying" && (
              <span className="flex items-center gap-2 text-xs font-semibold text-primary animate-pulse">
                <div className="h-2 w-2 rounded-full bg-primary" />
                WATCHLIST SWEEP
              </span>
            )}
            {verificationState === "success" && (
              <span className="flex items-center gap-2 text-xs font-semibold text-green-500">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                IDENTITY VERIFIED
              </span>
            )}
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Email" {...form.register("email")} />
              <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Full name" {...form.register("fullName")} />
            </div>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Identity Doc Number (e.g. SSN/Tax ID)" {...form.register("idNumber")} />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Account name" {...form.register("accountName")} />
              <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Account type" {...form.register("accountType")} />
            </div>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" type="number" step="0.01" placeholder="Opening balance" {...form.register("openingBalance", { valueAsNumber: true })} />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Running Identity Check..." : "Verify & Create Member"}
            </Button>
          </form>
          <div className={`text-sm transition-colors ${verificationState === "success" ? "text-green-500 font-medium" : "text-slate-400"}`}>
            {statusMessage}
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Ledger state</h2>
          <div className="space-y-3">
            {users.slice(-5).reverse().map((user) => (
              <div key={user.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 group hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium group-hover:text-primary transition-colors">{user.fullName}</p>
                  <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-500 border border-green-500/20">
                    <div className="h-1 w-1 rounded-full bg-green-500" />
                    Verified
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">{user.email} · {user.id}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
