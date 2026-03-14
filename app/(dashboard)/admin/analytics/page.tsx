import { Suspense } from "react";

import { AdminAnalyticsWorkspace } from "@/components/admin/admin-analytics-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Admin Analytics" };

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AdminAnalyticsWorkspace />
    </Suspense>
  );
}
