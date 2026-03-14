import { Suspense } from "react";

import { CreditWorkspace } from "@/components/credit/credit-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Credit" };

export default function CreditPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CreditWorkspace />
    </Suspense>
  );
}
