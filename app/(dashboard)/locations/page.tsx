import { Suspense } from "react";

import { PageFallback } from "@/components/dashboard/page-fallback";
import { LocationsWorkspace } from "@/components/locations/locations-workspace";

export const metadata = { title: "Locations" };

export default function LocationsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <LocationsWorkspace />
    </Suspense>
  );
}
