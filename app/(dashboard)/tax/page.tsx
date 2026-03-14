import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { TaxWorkspace } from "@/components/tax/tax-workspace";

export const metadata = { title: "Tax" };

export default function TaxPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <TaxWorkspace />
    </Suspense>
  );
}
