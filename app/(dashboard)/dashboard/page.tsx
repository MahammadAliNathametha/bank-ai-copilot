import { DashboardOverview } from "@/components/dashboard/overview";
import { PageFallback } from "@/components/dashboard/page-fallback";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard"
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <DashboardOverview />
    </Suspense>
  );
}
