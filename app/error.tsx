"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="max-w-lg space-y-4 rounded-[2rem] border border-red-200 bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">Service issue</p>
        <h1 className="font-display text-4xl">Something interrupted the banking flow.</h1>
        <p className="text-sm text-slate-600">{error.message}</p>
        <Button onClick={reset}>Retry</Button>
      </div>
    </main>
  );
}
