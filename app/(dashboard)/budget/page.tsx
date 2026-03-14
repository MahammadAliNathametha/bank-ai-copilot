import { Suspense } from "react";

import { BudgetWorkspace } from "@/components/budget/budget-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Budget" };

export default function BudgetPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <BudgetWorkspace />
    </Suspense>
  );
}
