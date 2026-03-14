import type { Metadata } from "next";
import "./globals.css";

import { QueryProvider } from "@/components/providers/query-provider";
import { TenantProvider } from "@/components/providers/tenant-provider";

export const metadata: Metadata = {
  title: "Bank AI Copilot",
  description: "White-label SaaS banking platform scaffold"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <TenantProvider>{children}</TenantProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
