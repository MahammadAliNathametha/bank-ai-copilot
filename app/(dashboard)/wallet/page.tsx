import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { WalletWorkspace } from "@/components/wallet/wallet-workspace";
export const metadata = { title: "Digital Wallet" };
export default function WalletPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <WalletWorkspace />
    </Suspense>
  );
}
