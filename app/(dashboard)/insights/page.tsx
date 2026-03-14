import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { InsightsWorkspace } from "@/components/insights/insights-workspace";

export const metadata = {
  title: "Insights"
};

export default function InsightsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <InsightsWorkspace />
    </Suspense>
  );
}
