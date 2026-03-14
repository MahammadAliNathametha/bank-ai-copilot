import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { DocumentsWorkspace } from "@/components/documents/documents-workspace";

export const metadata = { title: "Documents" };

export default function DocumentsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <DocumentsWorkspace />
    </Suspense>
  );
}
