"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import type { AdminMetricRecord, SupportTicketRecord, UserProfile } from "@/lib/data/mock-bank-store";

const setupBankSchema = z.object({
  userId: z.string().min(1),
  bankName: z.string().min(2),
  slug: z.string().min(2),
  primaryColor: z.string().min(2),
  logoUrl: z.string().url()
});

type SetupBankValues = z.infer<typeof setupBankSchema>;

export function SetupBankWorkspace() {
  const queryClient = useQueryClient();
  const { data: users } = useSuspenseQuery({
    queryKey: ["users", "setup-bank"],
    queryFn: () => apiRequest<UserProfile[]>("/api/users")
  });
  const { data: metrics } = useSuspenseQuery({
    queryKey: ["admin-metrics", "setup-bank"],
    queryFn: () => apiRequest<AdminMetricRecord[]>("/api/admin")
  });

  const form = useForm<SetupBankValues>({
    resolver: zodResolver(setupBankSchema),
    defaultValues: {
      userId: users[0]?.id ?? "11111111-1111-1111-1111-111111111112",
      bankName: "New Community Bank",
      slug: "new-community-bank",
      primaryColor: "210 80% 45%",
      logoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=120&q=80"
    }
  });

  const previewTheme = useMemo(() => ({
    background: `hsl(${form.watch("primaryColor") || "210 80% 45%"})`
  }), [form]);

  const mutation = useMutation({
    mutationFn: (values: SetupBankValues) =>
      apiRequest<SupportTicketRecord>("/api/support", {
        method: "POST",
        body: JSON.stringify({
          userId: values.userId,
          subject: `Tenant provisioning request: ${values.bankName}`,
          message: `slug=${values.slug}; primaryColor=${values.primaryColor}; logoUrl=${values.logoUrl}`,
          status: "open"
        })
      }),
    onSuccess: () => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["support"] });
      });
    }
  });

  return (
    <SectionShell
      eyebrow="Onboarding"
      title="Provision a tenant, theme, and subdomain demo"
      description="This page replaces the shell with a live provisioning request flow and theme preview using the existing support and admin surfaces."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Profiles" value={String(users.length)} note="Current operator/member roster." />
        <MetricCard label="Admin metrics" value={String(metrics.length)} note="Current SaaS operating signals." />
        <MetricCard label="Provisioning path" value="Live request" note="Requests now persist through the support API." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Bank setup request</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("userId")}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))}
            </select>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Bank name" {...form.register("bankName")} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Slug" {...form.register("slug")} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Primary color HSL" {...form.register("primaryColor")} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Logo URL" {...form.register("logoUrl")} />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Create provisioning request"}
            </Button>
          </form>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Theme preview</h2>
          <div className="rounded-[2rem] p-6 text-white" style={previewTheme}>
            <p className="text-xs uppercase tracking-[0.35em] text-white/75">White-label preview</p>
            <h3 className="mt-3 font-display text-4xl">{form.watch("bankName") || "Bank name"}</h3>
            <p className="mt-3 text-sm text-white/85">Subdomain preview: {form.watch("slug") || "tenant"}.yourapp.com</p>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}
