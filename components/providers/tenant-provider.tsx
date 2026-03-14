"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import type { TenantTheme } from "@/lib/data/demo";

type TenantContextValue = {
  tenant: TenantTheme | null;
  isLoading: boolean;
  setTenant: (t: TenantTheme | null) => void;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    return { tenant: null, isLoading: false, setTenant: () => {} };
  }
  return ctx;
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenantState] = useState<TenantTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setTenant = useCallback((t: TenantTheme | null) => {
    setTenantState(t);
    if (t?.primaryHsl) {
      document.documentElement.style.setProperty("--primary", t.primaryHsl);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tenant")
      .then((r) => r.json())
      .then((data: TenantTheme) => {
        if (!cancelled) {
          setTenant(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTenantState(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [setTenant]);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}
