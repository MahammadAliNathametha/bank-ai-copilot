import { Suspense } from "react";

import { AdminMetricsWorkspace } from "@/components/admin/admin-metrics-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Admin Metrics" };

export default function AdminMetricsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AdminMetricsWorkspace />
    </Suspense>
  );
}
