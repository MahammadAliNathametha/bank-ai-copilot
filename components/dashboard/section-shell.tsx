import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionShell({
  eyebrow,
  title,
  description,
  children,
  className
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(var(--primary)/0.05),_transparent_32%)]" />
        <div className="relative grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end z-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
            <h1 className="max-w-4xl font-display text-4xl leading-[0.95] tracking-tight md:text-5xl text-white">{title}</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-400">{description}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-5 py-5 text-white shadow-xl relative overflow-hidden hidden md:block">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Operating Note</p>
            <p className="relative mt-3 text-sm leading-6 text-slate-300">
              Live tenant data, admin instrumentation, and realtime invalidation now share the same UI shell instead of separate scaffold patterns.
            </p>
          </div>
        </div>
      </section>
      <div className={cn("space-y-6", className)}>{children}</div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  note
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Card className="space-y-3 overflow-hidden group hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-400">{label}</p>
        <div className="h-2 w-2 rounded-full bg-primary/80 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(255,153,0,0.5)] transition" />
      </div>
      <p className="font-display text-4xl leading-none tracking-tight text-white">{value}</p>
      <p className="text-sm leading-6 text-slate-400">{note}</p>
    </Card>
  );
}
