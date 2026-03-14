import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { CryptoWorkspace } from "@/components/crypto/crypto-workspace";
export const metadata = { title: "Crypto" };
export default function CryptoPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CryptoWorkspace />
    </Suspense>
  );
}
