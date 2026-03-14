"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition } from "react";
import { useForm } from "react-hook-form";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { supportTicketCreateSchema } from "@/lib/validations/banking";
import type { SupportTicketRecord } from "@/lib/data/mock-bank-store";
import type { z } from "zod";

type SupportFormValues = z.infer<typeof supportTicketCreateSchema>;

import { SupportVoiceInput } from "./voice-input";

export function SupportWorkspace() {
  const queryClient = useQueryClient();
  const { data: tickets } = useSuspenseQuery({
    queryKey: ["support"],
    queryFn: () => apiRequest<SupportTicketRecord[]>("/api/support")
  });

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportTicketCreateSchema),
    defaultValues: {
      userId: "support-user",
      subject: "Need help with a transfer",
      message: "Please review my pending transfer and confirm the status.",
      status: "open"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: SupportFormValues) =>
      apiRequest<SupportTicketRecord>("/api/support", {
        method: "POST",
        body: JSON.stringify(values)
      }),
    onSuccess: () => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["support"] });
      });
      form.reset();
    }
  });

  return (
    <SectionShell
      eyebrow="Support"
      title="Chat-inspired support intake with tenant-specific service framing"
      description="Support tickets stay inside the same tenant boundary as all other banking data and can evolve into live chat later."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Open tickets" value={String(tickets.filter((ticket) => ticket.status !== "closed").length)} note="Tickets needing action." />
        <MetricCard label="Total tickets" value={String(tickets.length)} note="Current workload for the tenant’s support pod." />
        <MetricCard label="Escalation state" value="Ready" note="Bot-to-human handoff remains a stubbed next step." />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SupportVoiceInput />
          <Card className="space-y-4">
            <h2 className="font-display text-3xl">Open a support request</h2>
            <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
              <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="User id" {...form.register("userId")} />
              <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Subject" {...form.register("subject")} />
              <textarea className="min-h-32 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm" placeholder="Message" {...form.register("message")} />
              <Button className="w-full" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Submitting..." : "Create ticket"}
              </Button>
            </form>
          </Card>
        </div>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Tenant support queue</h2>
          {tickets.map((ticket) => (
            <div key={ticket.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{ticket.subject}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{ticket.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{ticket.message}</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
