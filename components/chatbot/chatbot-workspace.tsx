"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Mic, MicOff, Volume2, Send, Bot, User,
  Sparkles, MessageSquare, AudioLines
} from "lucide-react";

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

/* ── voice command definitions ─────────────────────────────────────── */
const voiceCommands = [
  { command: "Check my balance", response: "Your total balance across all accounts is $47,250.00. Your checking account has $12,450 and savings has $34,800.", category: "balance" },
  { command: "Transfer $500 to savings", response: "I'll transfer $500 from your checking to savings. Shall I proceed?", category: "transfer" },
  { command: "Show recent transactions", response: "Your last 5 transactions: Netflix $15.99, Whole Foods $67.23, Uber $23.40, Starbucks $5.75, Amazon $89.99.", category: "transactions" },
  { command: "Pay my credit card bill", response: "Your credit card bill is $1,245.67 due on March 20. Would you like to pay the full balance or minimum?", category: "payment" },
  { command: "What's my credit score?", response: "Your current credit score is 742 (Good). It increased 8 points from last month.", category: "credit" },
  { command: "Lock my debit card", response: "Your debit card ending in 4829 has been temporarily locked. You can unlock it anytime.", category: "security" },
];

const chatHistory: { role: "bot" | "user"; message: string; time: string }[] = [
  { role: "bot", message: "Welcome back! I'm your AI banking assistant. You can type or use voice commands. Try saying 'Check my balance' or 'Show recent transactions'.", time: "Now" },
];

export function ChatbotWorkspace() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"chat" | "voice">("chat");
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [messages, setMessages] = useState(chatHistory);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceResponse, setVoiceResponse] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

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
      question: ""
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
    }
  });

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: "user" as const, message: text, time: "Just now" };
    setMessages(prev => [...prev, userMsg]);

    // Simulate AI response
    const matched = voiceCommands.find(vc =>
      text.toLowerCase().includes(vc.command.toLowerCase().split(" ").slice(0, 2).join(" "))
    );

    setTimeout(() => {
      const botMsg = {
        role: "bot" as const,
        message: matched?.response || `I understand you're asking about "${text}". Based on your financial health score of ${insights.healthScore}, here's my suggestion: ${insights.insights[0]?.summary || "Please check back later for personalized insights."}`,
        time: "Just now"
      };
      setMessages(prev => [...prev, botMsg]);
    }, 800);

    form.setValue("question", "");
  }, [form, insights]);

  const handleVoiceCommand = useCallback(() => {
    if (voiceState === "idle") {
      setVoiceState("listening");
      setVoiceTranscript("");
      setVoiceResponse("");

      // Simulate voice recognition
      setTimeout(() => {
        const randomCmd = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
        setVoiceTranscript(randomCmd.command);
        setVoiceState("processing");

        setTimeout(() => {
          setVoiceResponse(randomCmd.response);
          setVoiceState("speaking");

          setTimeout(() => {
            setVoiceState("idle");
          }, 3000);
        }, 1200);
      }, 2000);
    } else {
      setVoiceState("idle");
    }
  }, [voiceState]);

  const tabs = [
    { key: "chat" as const, label: "Chat Assistant", icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { key: "voice" as const, label: "Voice Banking", icon: <Mic className="h-3.5 w-3.5" /> },
  ];

  return (
    <SectionShell
      eyebrow="AI Assistant"
      title="Chat & voice-powered banking assistant with smart escalation"
      description="Natural language chat and voice commands for balance checks, transfers, payments, and account management. Escalates complex queries to live support."
    >
      <div className="flex gap-1 rounded-xl border border-white/10 bg-[#0a0a0a] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-primary/15 text-primary shadow-[0_0_15px_rgba(255,153,0,0.08)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Health Score" value={String(insights.healthScore)} note="AI context for guidance" />
        <MetricCard label="Insights" value={String(insights.insights.length)} note="Available prompts" />
        <MetricCard label="Escalations" value={String(tickets.filter((t) => t.subject.includes("Chatbot")).length)} note="Tickets from assistant" />
        <MetricCard label="Voice Commands" value={String(voiceCommands.length)} note="Recognized patterns" />
      </div>

      {/* ── Chat Tab ─────────────────────────────────────────────────── */}
      {activeTab === "chat" && (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="flex flex-col h-[500px]">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-1 mb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`shrink-0 rounded-xl p-2 h-fit ${
                    msg.role === "bot"
                      ? "bg-primary/15 text-primary"
                      : "bg-white/10 text-white"
                  }`}>
                    {msg.role === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "bot"
                      ? "bg-white/5 border border-white/10 text-slate-300"
                      : "bg-primary/15 border border-primary/20 text-white"
                  }`}>
                    <p>{msg.message}</p>
                    <p className="mt-1 text-[10px] text-slate-500">{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div className="flex items-center gap-2 border-t border-white/10 pt-4">
              <input
                placeholder="Ask anything about your finances..."
                className="flex-1 rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                value={form.watch("question")}
                onChange={(e) => form.setValue("question", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage(form.watch("question"));
                  }
                }}
              />
              <button
                onClick={() => handleSendMessage(form.watch("question"))}
                className="rounded-xl bg-primary p-3 text-black hover:bg-primary/90 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </Card>

          {/* Quick commands + escalation */}
          <div className="space-y-4">
            <Card className="space-y-3">
              <h3 className="font-display text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick Commands
              </h3>
              <div className="space-y-2">
                {voiceCommands.slice(0, 4).map((vc) => (
                  <button
                    key={vc.command}
                    onClick={() => handleSendMessage(vc.command)}
                    className="w-full text-left rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-xs text-slate-300 hover:border-primary/30 hover:text-white transition-colors"
                  >
                    &ldquo;{vc.command}&rdquo;
                  </button>
                ))}
              </div>
            </Card>

            <Card className="space-y-3">
              <h3 className="font-display text-lg">Recent Escalations</h3>
              {tickets
                .filter((t) => t.subject.includes("Chatbot"))
                .slice(0, 3)
                .map((ticket) => (
                  <div key={ticket.id} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-white">{ticket.subject}</p>
                      <span className="rounded-full bg-[#0a0a0a] px-2 py-0.5 text-[10px] font-semibold text-slate-400">{ticket.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">{ticket.message}</p>
                  </div>
                ))}
              <Button
                variant="ghost"
                className="w-full text-xs"
                onClick={() => {
                  mutation.mutate({
                    userId: "11111111-1111-1111-1111-111111111112",
                    question: "Manual escalation from chatbot"
                  });
                }}
              >
                Escalate to Support
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* ── Voice Tab ────────────────────────────────────────────────── */}
      {activeTab === "voice" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
            {/* Voice visualization */}
            <div className="relative">
              <div className={`h-32 w-32 rounded-full flex items-center justify-center transition-all duration-500 ${
                voiceState === "listening"
                  ? "bg-primary/20 shadow-[0_0_60px_rgba(255,153,0,0.3)] animate-pulse"
                  : voiceState === "processing"
                  ? "bg-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.3)]"
                  : voiceState === "speaking"
                  ? "bg-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.3)]"
                  : "bg-white/10"
              }`}>
                {voiceState === "listening" && <Mic className="h-12 w-12 text-primary animate-pulse" />}
                {voiceState === "processing" && <AudioLines className="h-12 w-12 text-blue-400 animate-pulse" />}
                {voiceState === "speaking" && <Volume2 className="h-12 w-12 text-emerald-400 animate-pulse" />}
                {voiceState === "idle" && <Mic className="h-12 w-12 text-slate-400" />}
              </div>

              {/* Animated rings */}
              {voiceState === "listening" && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                  <div className="absolute -inset-4 rounded-full border border-primary/10 animate-ping" style={{ animationDelay: "0.5s" }} />
                </>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="font-display text-xl text-white">
                {voiceState === "idle" && "Tap to speak"}
                {voiceState === "listening" && "Listening..."}
                {voiceState === "processing" && "Processing..."}
                {voiceState === "speaking" && "Responding..."}
              </p>
              {voiceTranscript && (
                <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 max-w-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">You said</p>
                  <p className="text-sm text-white">&ldquo;{voiceTranscript}&rdquo;</p>
                </div>
              )}
              {voiceResponse && (
                <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 max-w-sm mt-3">
                  <p className="text-[10px] font-bold uppercase text-primary/60 mb-1">Response</p>
                  <p className="text-sm text-slate-300">{voiceResponse}</p>
                </div>
              )}
            </div>

            <Button
              onClick={handleVoiceCommand}
              className={`px-8 py-3 text-sm font-bold ${
                voiceState === "listening" ? "bg-red-500 hover:bg-red-600" : ""
              }`}
            >
              {voiceState === "idle" ? (
                <><Mic className="h-4 w-4 mr-2" />Start Voice Command</>
              ) : voiceState === "listening" ? (
                <><MicOff className="h-4 w-4 mr-2" />Stop Listening</>
              ) : (
                <><AudioLines className="h-4 w-4 mr-2" />Processing...</>
              )}
            </Button>
          </Card>

          <Card className="space-y-4">
            <h2 className="font-display text-2xl">Available Voice Commands</h2>
            <p className="text-sm text-slate-400">Try any of these commands by tapping the microphone or saying them aloud.</p>
            <div className="space-y-2">
              {voiceCommands.map((vc) => (
                <button
                  key={vc.command}
                  onClick={() => {
                    setVoiceTranscript(vc.command);
                    setVoiceState("processing");
                    setTimeout(() => {
                      setVoiceResponse(vc.response);
                      setVoiceState("speaking");
                      setTimeout(() => setVoiceState("idle"), 3000);
                    }, 1000);
                  }}
                  className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">&ldquo;{vc.command}&rdquo;</span>
                  </div>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase">{vc.category}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </SectionShell>
  );
}
