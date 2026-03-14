import { Suspense } from "react";

import { CardsWorkspace } from "@/components/cards/cards-workspace";
import { PageFallback } from "@/components/dashboard/page-fallback";

export const metadata = { title: "Cards" };

export default function CardsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <CardsWorkspace />
    </Suspense>
  );
}
