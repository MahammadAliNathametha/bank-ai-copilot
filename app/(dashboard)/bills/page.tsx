import { Suspense } from "react";

import { BillsWorkspace } from "@/components/bills/bills-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";
export const metadata = { title: "Bills" };
export default function BillsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <BillsWorkspace />
    </Suspense>
  );
}
