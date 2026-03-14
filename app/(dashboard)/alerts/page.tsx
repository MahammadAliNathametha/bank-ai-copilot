import { Suspense } from "react";

import { AlertsWorkspace } from "@/components/alerts/alerts-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Alerts" };

export default function AlertsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AlertsWorkspace />
    </Suspense>
  );
}
