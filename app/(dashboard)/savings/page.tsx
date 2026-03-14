import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { SavingsWorkspace } from "@/components/savings/savings-workspace";

export const metadata = { title: "Savings" };

export default function SavingsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SavingsWorkspace />
    </Suspense>
  );
}
