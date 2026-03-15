import { Suspense } from "react";
import { P2PWorkspace } from "@/components/payments/p2p-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "P2P Payments" };

export default function P2PPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <P2PWorkspace />
    </Suspense>
  );
}
