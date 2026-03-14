import { Suspense } from "react";
import { PageFallback } from "@/components/dashboard/page-fallback";
import { BeneficiariesWorkspace } from "@/components/payments/beneficiaries-workspace";

export const metadata = { title: "Beneficiaries" };

export default function BeneficiariesPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <BeneficiariesWorkspace />
    </Suspense>
  );
}
