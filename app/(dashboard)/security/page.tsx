import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { SecurityWorkspace } from "@/components/security/security-workspace";
export const metadata = { title: "Security" };
export default function SecurityPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SecurityWorkspace />
    </Suspense>
  );
}
