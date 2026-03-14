import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { TransfersWorkspace } from "@/components/transfers/transfers-workspace";
export const metadata = { title: "Transfers" };

export default function TransfersPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <TransfersWorkspace />
    </Suspense>
  );
}
