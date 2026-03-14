import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { TransactionsWorkspace } from "@/components/transactions/transactions-workspace";
export const metadata = { title: "Transactions" };
export default function TransactionsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <TransactionsWorkspace />
    </Suspense>
  );
}
