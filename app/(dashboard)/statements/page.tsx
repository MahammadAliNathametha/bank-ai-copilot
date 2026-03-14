import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { StatementsWorkspace } from "@/components/statements/statements-workspace";

export const metadata = { title: "Statements" };

export default function StatementsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <StatementsWorkspace />
    </Suspense>
  );
}
