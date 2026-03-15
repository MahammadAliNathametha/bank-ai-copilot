import { Suspense } from "react";
import { CheckDepositWorkspace } from "@/components/payments/check-deposit-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Mobile Check Deposit" };

export default function CheckDepositPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CheckDepositWorkspace />
    </Suspense>
  );
}
