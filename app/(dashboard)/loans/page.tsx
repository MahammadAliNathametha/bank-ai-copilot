import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { LoansWorkspace } from "@/components/loans/loans-workspace";

export const metadata = { title: "Loans" };

export default function LoansPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <LoansWorkspace />
    </Suspense>
  );
}
