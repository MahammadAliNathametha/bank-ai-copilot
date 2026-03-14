import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function FloatCard({
  className,
  title,
  subtitle,
  children
}: {
  className?: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.35rem] border border-white/10 bg-[#0a0a0a]/[0.06] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-sky-200/80">{subtitle}</p>
          <p className="mt-2 font-display text-xl tracking-tight text-white">{title}</p>
        </div>
        <div className="mt-1 size-9 rounded-full bg-[radial-gradient(circle_at_top,hsl(203_92%_72%/0.40),transparent_70%)] ring-1 ring-white/10" />
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

function FauxPhone({
  className,
  accent = "from-sky-300/40 via-white/10 to-transparent"
}: {
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-[360px] w-[208px] rotate-[-10deg] overflow-hidden rounded-[2.15rem] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_34px_120px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", accent)} />
      <div className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-white/10" />
      <div className="absolute inset-x-4 top-12 rounded-[1.3rem] bg-white/10 p-4 ring-1 ring-white/10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/60">Daily pulse</p>
        <p className="mt-3 font-display text-3xl text-white">$67,893</p>
        <div className="mt-4 grid gap-2">
          <div className="h-8 rounded-xl bg-white/10" />
          <div className="h-8 rounded-xl bg-[#0a0a0a]/8" />
          <div className="h-8 rounded-xl bg-[#0a0a0a]/6" />
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-6 grid gap-2">
        <div className="rounded-[1.1rem] bg-white/10 p-3 ring-1 ring-white/10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">Money movement</p>
          <p className="mt-2 text-sm font-semibold text-white/90">Payment request received</p>
          <div className="mt-3 h-9 rounded-full bg-[#0a0a0a]/12" />
        </div>
      </div>
    </div>
  );
}

function FauxDesktop({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-[320px] w-[520px] overflow-hidden rounded-[2.1rem] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_46px_140px_rgba(0,0,0,0.50)]",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(125,211,252,0.24),transparent_42%),radial-gradient(circle_at_82%_70%,rgba(56,189,248,0.16),transparent_45%)]" />
      <div className="relative flex h-14 items-center justify-between gap-4 border-b border-white/10 px-7">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-2xl bg-white/10 ring-1 ring-white/10" />
          <div className="grid gap-1">
            <div className="h-2.5 w-24 rounded-full bg-[#0a0a0a]/20" />
            <div className="h-2 w-16 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-24 rounded-full bg-white/10 ring-1 ring-white/10" />
          <div className="size-9 rounded-full bg-white/10 ring-1 ring-white/10" />
        </div>
      </div>
      <div className="relative grid grid-cols-[1.05fr_0.95fr] gap-6 p-7">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/55">Payments</p>
          <p className="font-display text-4xl text-white">History</p>
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                className="flex items-center justify-between rounded-[1.2rem] bg-[#0a0a0a]/8 px-4 py-3 ring-1 ring-white/10"
              >
                <div className="space-y-2">
                  <div className="h-2.5 w-36 rounded-full bg-[#0a0a0a]/25" />
                  <div className="h-2 w-24 rounded-full bg-[#0a0a0a]/12" />
                </div>
                <div className="h-2.5 w-16 rounded-full bg-[#0a0a0a]/18" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/55">New payment</p>
          <div className="space-y-3 rounded-[1.8rem] bg-[#0a0a0a]/6 p-5 ring-1 ring-white/10">
            <div className="h-11 rounded-2xl bg-white/10" />
            <div className="h-11 rounded-2xl bg-white/10" />
            <div className="h-11 rounded-2xl bg-white/10" />
            <div className="mt-2 h-11 rounded-full bg-[#0a0a0a]/16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[760px]">
      <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.24),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(14,116,144,0.35),transparent_40%)] blur-2xl" />

      <div className="relative">
        <FauxDesktop className="mx-auto hidden lg:block" />
        <FauxPhone className="absolute -bottom-10 left-2 hidden lg:block" />
        <FauxPhone
          className="absolute -right-2 -top-10 hidden rotate-[12deg] lg:block"
          accent="from-cyan-300/30 via-white/10 to-transparent"
        />
      </div>

      <FloatCard
        className="absolute -left-2 top-8 hidden max-w-[250px] lg:block"
        subtitle="Business wires"
        title="Approvals that keep pace"
      >
        <div className="mt-3 grid gap-2">
          <div className="h-2 w-40 rounded-full bg-[#0a0a0a]/15" />
          <div className="h-2 w-28 rounded-full bg-white/10" />
        </div>
      </FloatCard>

      <FloatCard
        className="absolute -right-4 top-10 hidden max-w-[260px] lg:block"
        subtitle="Asset accounts"
        title="$67,893.12"
      >
        <div className="mt-3 flex items-center justify-between text-xs text-white/65">
          <span>Ending deposit balance</span>
          <span className="rounded-full bg-white/10 px-2 py-1 text-white/80 ring-1 ring-white/10">+12%</span>
        </div>
      </FloatCard>
    </div>
  );
}

