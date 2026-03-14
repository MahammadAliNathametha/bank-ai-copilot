import { Suspense } from "react";

import { AccountsWorkspace } from "@/components/accounts/accounts-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = {
  title: "Accounts"
};

export default function AccountsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AccountsWorkspace />
    </Suspense>
  );
}
