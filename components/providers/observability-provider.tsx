"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ObservabilityProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) {
      return;
    }

    const payload = {
      path: pathname,
      duration: Math.round(performance.now()),
      category: "navigation",
      tags: {
        userAgent: navigator.userAgent
      }
    };

    void fetch("/api/observability/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  }, [pathname]);

  return <>{children}</>;
}
