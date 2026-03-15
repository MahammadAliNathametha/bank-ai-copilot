"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useTenant } from "@/components/providers/tenant-provider";

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

  const { tenant } = useTenant();

  const tenantId = tenant?.id;
  const filteredResources = useMemo(() => [...new Set(resources)], [resources]);

  useEffect(() => {
    if (!tenantId || !filteredResources.length) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    let reconnectAttempts = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isActive = true;
    let activeChannel = supabase.channel(`tenant-${tenantId}:${filteredResources.join("-")}`);

    const subscribeChannel = () => {
      if (!isActive) {
        return;
      }

      activeChannel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          reconnectAttempts = 0;
          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
          }
        }

        if (status === "CLOSED" || status === "TIMED_OUT" || status === "CHANNEL_ERROR") {
          reconnectAttempts += 1;
          const delay = Math.min(4000, 500 * reconnectAttempts);
          reconnectTimer = setTimeout(() => {
            if (!isActive) {
              return;
            }
            void supabase.removeChannel(activeChannel);
            activeChannel = supabase.channel(`tenant-${tenantId}:${filteredResources.join("-")}`);
            subscribeChannel();
          }, delay);
        }
      });
    };

    for (const resource of filteredResources) {
      activeChannel.on(
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

    subscribeChannel();

    return () => {
      isActive = false;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      void supabase.removeChannel(activeChannel);
    };
  }, [filteredResources, tenantId]);
}
