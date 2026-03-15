import { Suspense } from "react";
import { TaxWorkspace } from "@/components/finance/tax-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";
export const metadata = { title: "Tax Center" };
export default function TaxPage() {
  return <Suspense fallback={<PageFallback />}><TaxWorkspace /></Suspense>;
}
