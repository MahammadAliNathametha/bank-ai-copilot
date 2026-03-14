"use client";

import { useDeferredValue, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { SectionShell, MetricCard } from "@/components/dashboard/section-shell";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/services/http";
import type { LocationRecord } from "@/lib/data/mock-bank-store";

export function LocationsWorkspace() {
  const [kindFilter, setKindFilter] = useState<"all" | "atm" | "branch">("all");
  const deferredKindFilter = useDeferredValue(kindFilter);

  const { data: locations } = useSuspenseQuery({
    queryKey: ["locations"],
    queryFn: () => apiRequest<LocationRecord[]>("/api/locations")
  });

  const visibleLocations = locations.filter((location) => deferredKindFilter === "all" || location.kind === deferredKindFilter);

  return (
    <SectionShell
      eyebrow="Locations"
      title="Branch and ATM discovery over the live tenant location service"
      description="This page now surfaces the tenant-scoped locations API instead of a placeholder shell, while preserving room for a future map embed."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Visible sites" value={String(visibleLocations.length)} note="Current filter result count." />
        <MetricCard label="Branches" value={String(locations.filter((location) => location.kind === "branch").length)} note="Full-service tenant locations." />
        <MetricCard label="ATM points" value={String(locations.filter((location) => location.kind === "atm").length)} note="Self-service access points." />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl">Filter locations</h2>
          <div className="flex flex-wrap gap-2">
            {(["all", "branch", "atm"] as const).map((kind) => (
              <button
                key={kind}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${kindFilter === kind ? "bg-primary text-white" : "bg-white/5 border border-white/10 text-slate-300"}`}
                onClick={() => setKindFilter(kind)}
                type="button"
              >
                {kind === "all" ? "All" : kind.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="rounded-3xl bg-white/10 px-5 py-6 text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">Coverage note</p>
            <p className="mt-3 text-sm text-white/85">Map rendering is still the next UX step, but the tenant-scoped location inventory is now live-backed and filterable.</p>
          </div>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {visibleLocations.map((location) => (
            <Card key={location.id} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold">{location.name}</h2>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">{location.kind}</span>
              </div>
              <p className="text-sm text-slate-400">{location.address}</p>
              <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-300">
                Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
