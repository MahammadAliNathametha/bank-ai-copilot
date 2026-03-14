import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { SupportWorkspace } from "@/components/support/support-workspace";
export const metadata = { title: "Support" };
export default function SupportPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SupportWorkspace />
    </Suspense>
  );
}
