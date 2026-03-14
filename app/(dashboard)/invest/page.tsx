import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { InvestWorkspace } from "@/components/invest/invest-workspace";

export const metadata = { title: "Invest" };

export default function InvestPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <InvestWorkspace />
    </Suspense>
  );
}
