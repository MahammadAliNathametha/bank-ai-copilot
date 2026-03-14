"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import type { InsightRecord, SupportTicketRecord } from "@/lib/data/mock-bank-store";

type InsightsPayload = {
  healthScore: number;
  savingsRate: number;
  totalBalance: number;
  monthlySpend: number;
  insights: InsightRecord[];
};

const chatbotSchema = z.object({
  userId: z.string().min(1),
  question: z.string().min(2)
});

type ChatbotFormValues = z.infer<typeof chatbotSchema>;

export function ChatbotWorkspace() {
  const queryClient = useQueryClient();
  const { data: insights } = useSuspenseQuery({
    queryKey: ["insights", "chatbot"],
    queryFn: () => apiRequest<InsightsPayload>("/api/insights")
  });
  const { data: tickets } = useSuspenseQuery({
    queryKey: ["support", "chatbot"],
    queryFn: () => apiRequest<SupportTicketRecord[]>("/api/support")
  });

  const form = useForm<ChatbotFormValues>({
    resolver: zodResolver(chatbotSchema),
    defaultValues: {
      userId: "11111111-1111-1111-1111-111111111112",
      question: "I need help understanding my recent spending."
    }
  });

  const mutation = useMutation({
    mutationFn: (values: ChatbotFormValues) =>
      apiRequest<SupportTicketRecord>("/api/support", {
        method: "POST",
        body: JSON.stringify({
          userId: values.userId,
          subject: "Chatbot escalation",
          message: values.question,
          status: "open"
        })
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
      eyebrow="Chatbot"
      title="Support automation that escalates into the live ticket queue"
      description="This page replaces the chatbot shell with a practical support assistant handoff built on the live insights and support APIs."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Health score" value={String(insights.healthScore)} note="Context the assistant can use for guidance." />
        <MetricCard label="Insight cues" value={String(insights.insights.length)} note="Available narrative prompts." />
        <MetricCard label="Escalations" value={String(tickets.filter((ticket) => ticket.subject.includes("Chatbot")).length)} note="Support tickets created from assistant handoff." />
        <MetricCard label="Open queue" value={String(tickets.filter((ticket) => ticket.status !== "closed").length)} note="Current support workload." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Ask the assistant</h2>
          <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4 text-sm text-slate-300">
            Suggested guidance: {insights.insights[0]?.summary ?? "No automated guidance available yet."}
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="User id" {...form.register("userId")} />
            <textarea className="min-h-32 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm" placeholder="Ask a question" {...form.register("question")} />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Escalating..." : "Send to support"}
            </Button>
          </form>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Recent escalations</h2>
          {tickets
            .filter((ticket) => ticket.subject.includes("Chatbot"))
            .slice(0, 5)
            .map((ticket) => (
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
