import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { SetupBankWorkspace } from "@/components/setup-bank/setup-bank-workspace";

export const metadata = {
  title: "Set Up Bank"
};

export default function SetupBankPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SetupBankWorkspace />
    </Suspense>
  );
}
