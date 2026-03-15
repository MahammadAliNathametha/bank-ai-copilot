import { Suspense } from "react";
import { InvestWorkspace } from "@/components/finance/invest-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";
export const metadata = { title: "Investments" };
export default function InvestPage() {
  return <Suspense fallback={<PageFallback />}><InvestWorkspace /></Suspense>;
}
