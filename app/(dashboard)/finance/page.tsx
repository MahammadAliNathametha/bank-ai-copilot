import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { FinanceWorkspace } from "@/components/finance/finance-workspace";

export const metadata = { title: "Finance" };

export default function FinancePage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <FinanceWorkspace />
    </Suspense>
  );
}
