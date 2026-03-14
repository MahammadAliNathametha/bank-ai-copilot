import { Suspense } from "react";
import { PageFallback } from "@/components/dashboard/page-fallback";
import { InstantPaymentWorkspace } from "@/components/payments/instant-payment-workspace";

export const metadata = { title: "Instant Payments" };

export default function InstantPaymentsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <InstantPaymentWorkspace />
    </Suspense>
  );
}
