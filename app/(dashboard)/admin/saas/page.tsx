import { Suspense } from "react";

import { AdminSaasWorkspace } from "@/components/admin/admin-saas-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "SaaS Admin" };

export default function AdminSaasPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AdminSaasWorkspace />
    </Suspense>
  );
}
