import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { AiInsightsWorkspace } from "@/components/insights/ai-insights-workspace";

export const metadata = { title: "AI Insights" };

export default function AiInsightsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AiInsightsWorkspace />
    </Suspense>
  );
}
