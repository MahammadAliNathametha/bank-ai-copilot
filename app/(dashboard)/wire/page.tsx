import { Suspense } from "react";
import { WireWorkspace } from "@/components/payments/wire-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";
export const metadata = { title: "Wire Transfers" };
export default function WirePage() {
  return <Suspense fallback={<PageFallback />}><WireWorkspace /></Suspense>;
}
