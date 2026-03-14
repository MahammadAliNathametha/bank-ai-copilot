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
import type { LocationRecord, SupportTicketRecord } from "@/lib/data/mock-bank-store";

const appointmentSchema = z.object({
  userId: z.string().min(1),
  locationName: z.string().min(2),
  timeSlot: z.string().min(2),
  agenda: z.string().min(2)
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export function AppointmentsWorkspace() {
  const queryClient = useQueryClient();
  const { data: locations } = useSuspenseQuery({
    queryKey: ["locations", "appointments"],
    queryFn: () => apiRequest<LocationRecord[]>("/api/locations")
  });
  const { data: tickets } = useSuspenseQuery({
    queryKey: ["support", "appointments"],
    queryFn: () => apiRequest<SupportTicketRecord[]>("/api/support")
  });

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      userId: "11111111-1111-1111-1111-111111111112",
      locationName: locations[0]?.name ?? "Downtown Branch",
      timeSlot: "2026-03-20 11:00",
      agenda: "Discuss account options and service upgrades"
    }
  });

  const mutation = useMutation({
    mutationFn: (values: AppointmentFormValues) =>
      apiRequest<SupportTicketRecord>("/api/support", {
        method: "POST",
        body: JSON.stringify({
          userId: values.userId,
          subject: `Appointment request at ${values.locationName}`,
          message: `${values.timeSlot} — ${values.agenda}`,
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

  const appointmentRequests = tickets.filter((ticket) => ticket.subject.toLowerCase().includes("appointment"));

  return (
    <SectionShell
      eyebrow="Appointments"
      title="Branch appointment intake grounded in live locations and support operations"
      description="This page uses existing locations and support APIs to replace the appointment shell with a real scheduling intake path."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Locations" value={String(locations.length)} note="Available service sites." />
        <MetricCard label="Requests" value={String(appointmentRequests.length)} note="Appointment tickets already captured." />
        <MetricCard label="Open items" value={String(appointmentRequests.filter((ticket) => ticket.status !== "closed").length)} note="Requests waiting for follow-up." />
        <MetricCard label="Branches" value={String(locations.filter((location) => location.kind === "branch").length)} note="Full-service booking destinations." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Request an appointment</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="User id" {...form.register("userId")} />
            <select className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" {...form.register("locationName")}>
              {locations.map((location) => (
                <option key={location.id} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
            <input className="w-full rounded-2xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Time slot" {...form.register("timeSlot")} />
            <textarea className="min-h-28 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm" placeholder="Agenda" {...form.register("agenda")} />
            <Button className="w-full" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Request appointment"}
            </Button>
          </form>
        </Card>
        <Card className="space-y-3">
          <h2 className="font-display text-3xl">Appointment queue</h2>
          {appointmentRequests.map((ticket) => (
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
