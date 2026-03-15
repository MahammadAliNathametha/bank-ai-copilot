import { Suspense } from "react";
import { SetupBankWorkspace } from "@/components/admin/setup-bank-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Bank Setup" };

export default function SetupBankPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SetupBankWorkspace />
    </Suspense>
  );
}
