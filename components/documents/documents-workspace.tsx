"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import { documentCreateSchema } from "@/lib/validations/banking";
import type { DocumentRecord } from "@/lib/data/mock-bank-store";

type DocumentFormValues = z.infer<typeof documentCreateSchema>;

export function DocumentsWorkspace() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: documents } = useSuspenseQuery({
    queryKey: ["documents"],
    queryFn: () => apiRequest<DocumentRecord[]>("/api/documents")
  });

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentCreateSchema),
    defaultValues: {
      userId: "11111111-1111-1111-1111-111111111112",
      type: "statement",
      status: "processing"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: DocumentFormValues) => {
      if (!selectedFile) {
        throw new Error("Select a file before uploading");
      }

      const formData = new FormData();
      formData.set("userId", values.userId);
      formData.set("type", values.type);
      formData.set("status", values.status);
      formData.set("file", selectedFile);

      return apiRequest<DocumentRecord>("/api/documents", {
        method: "POST",
        body: formData
      });
    },
    onSuccess: () => {
      startTransition(() => {
        void queryClient.invalidateQueries({ queryKey: ["documents"] });
      });
      form.reset();
      setSelectedFile(null);
    }
  });

  const readyCount = documents.filter((document) => document.status === "ready").length;

  return (
    <SectionShell
      eyebrow="Documents"
      title="Secure document intake and archive for the active tenant"
      description="This workspace now reads and writes against the live documents API while preserving the secure archive and statement flow shape."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Archive size" value={String(documents.length)} note="Visible tenant-scoped documents." />
        <MetricCard label="Ready now" value={String(readyCount)} note="Items available for retrieval." />
        <MetricCard label="Processing" value={String(documents.length - readyCount)} note="Uploads still being reviewed." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Register a document</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="User id" {...form.register("userId")} />
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Type" {...form.register("type")} />
            <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("status")}>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
            </select>
            <input
              className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save document"}
            </Button>
          </form>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Document archive</h2>
          {documents.map((document) => (
            <div key={document.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{document.type}</p>
                <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-semibold">{document.status}</span>
              </div>
              <p className="mt-2 break-all text-sm text-slate-400">{document.url}</p>
            </div>
          ))}
        </Card>
      </div>
    </SectionShell>
  );
}
