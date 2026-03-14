"use client";

import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type RealtimeResource = "accounts" | "transactions" | "transfers" | "insights";

const realtimeQueryGroups: Record<RealtimeResource, string[]> = {
  accounts: ["accounts"],
  transactions: ["transactions", "dashboard-transactions"],
  transfers: ["transfers"],
  insights: ["insights", "dashboard-insights"]
};

export function useSupabaseRealtime(resources: RealtimeResource[]) {
  const queryClient = useQueryClient();

  const invalidateForResource = useCallback((resource: RealtimeResource) => {
    const targets = realtimeQueryGroups[resource];

    for (const target of targets) {
      void queryClient.invalidateQueries({
        predicate: (query) => {
          const [first] = query.queryKey;
          return first === target;
        }
      });
    }
  }, [queryClient]);

  const invalidateRef = useRef(invalidateForResource);
  invalidateRef.current = invalidateForResource;

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const uniqueResources = [...new Set(resources)];
    const channel = supabase.channel(`tenant-live:${uniqueResources.join("-")}`);

    for (const resource of uniqueResources) {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: resource === "insights" ? "insights" : resource
        },
        () => {
          invalidateRef.current(resource);
        }
      );
    }

    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [resources]);
}
