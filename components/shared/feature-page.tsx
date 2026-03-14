import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FeaturePage({
  eyebrow,
  title,
  description,
  bullets
}: {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-base text-slate-400">{description}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {bullets.map((bullet) => (
          <Card key={bullet} className="space-y-3">
            <h2 className="font-semibold">{bullet}</h2>
            <p className="text-sm text-slate-400">
              Tenant-aware placeholder implementation. Error in tenant query? Validate Zod schema first; rerun migration checks before wiring production data.
            </p>
            <Button variant="secondary">Open flow</Button>
          </Card>
        ))}
      </section>
    </div>
  );
}
