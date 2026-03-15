import { Suspense } from "react";
import { BudgetWorkspace } from "@/components/finance/budget-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Budgets & Spending" };

export default function BudgetPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <BudgetWorkspace />
    </Suspense>
  );
}
