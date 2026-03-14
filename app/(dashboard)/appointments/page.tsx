import { Suspense } from "react";

import { AppointmentsWorkspace } from "@/components/appointments/appointments-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Appointments" };

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AppointmentsWorkspace />
    </Suspense>
  );
}
