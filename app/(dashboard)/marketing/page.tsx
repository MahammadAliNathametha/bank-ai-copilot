import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { MarketingWorkspace } from "@/components/marketing/marketing-workspace";
export const metadata = { title: "Marketing Campaigns" };
export default function MarketingPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <MarketingWorkspace />
    </Suspense>
  );
}
