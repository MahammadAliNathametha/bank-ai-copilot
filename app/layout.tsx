import type { Metadata } from "next";
import "./globals.css";

import { QueryProvider } from "@/components/providers/query-provider";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { ObservabilityProvider } from "@/components/providers/observability-provider";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Bank AI Copilot",
  description: "White-label SaaS banking platform scaffold"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>
            <ObservabilityProvider>
              <TenantProvider>{children}</TenantProvider>
            </ObservabilityProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
