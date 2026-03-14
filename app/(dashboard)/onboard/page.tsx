import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { OnboardWorkspace } from "@/components/onboard/onboard-workspace";

export const metadata = { title: "Onboard" };

export default function OnboardPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <OnboardWorkspace />
    </Suspense>
  );
}
