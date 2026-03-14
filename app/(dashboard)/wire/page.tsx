import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { WireWorkspace } from "@/components/wire/wire-workspace";

export const metadata = { title: "Wire Transfers" };

export default function WirePage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <WireWorkspace />
    </Suspense>
  );
}
