import { Suspense } from "react";
import { BusinessWorkspace } from "@/components/business/business-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";
export const metadata = { title: "Business Banking" };
export default function BusinessPage() {
  return <Suspense fallback={<PageFallback />}><BusinessWorkspace /></Suspense>;
}
