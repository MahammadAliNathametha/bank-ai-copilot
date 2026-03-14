import Link from "next/link";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Solutions"
};

const solutions = [
  {
    id: "onboarding",
    eyebrow: "Onboarding & account opening",
    title: "Originate new accounts with fewer drop-offs.",
    body: "Conversion-first flows that keep the experience consistent across device sizes, while remaining tenant-configurable for each institution."
  },
  {
    id: "digital",
    eyebrow: "Digital banking",
    title: "One shell for balances, movement, and service.",
    body: "Accounts, transactions, transfers, bills, documents, and security controls—delivered in a cohesive, branded workspace."
  },
  {
    id: "data",
    eyebrow: "Data & engagement",
    title: "Surface the next best action without overwhelming teams.",
    body: "Insights, operational metrics, and lightweight campaign hooks that can be tailored per tenant as your product matures."
  }
] as const;

export default function SolutionsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="relative overflow-hidden rounded-[2.6rem] border border-slate-200/70 bg-white/70 p-10 shadow-[0_30px_110px_rgba(15,23,42,0.12)] backdrop-blur md:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.20),transparent_64%)]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">Solutions</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            A platform-shaped scaffold that stays brandable.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Inspired by modern digital banking patterns and built for multi-tenant delivery—so every institution can ship the same product with its own
            look, language, and controls.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/landing">
              <Button>See the experience</Button>
            </Link>
            <Link href="/setup-bank">
              <Button variant="secondary">Configure branding</Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {solutions.map((s) => (
            <Card key={s.id} className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">{s.eyebrow}</p>
              <h2 className="font-display text-3xl tracking-tight text-slate-950">{s.title}</h2>
              <p className="text-sm leading-7 text-slate-600">{s.body}</p>
              <Link href={`#${s.id}`} className="text-sm font-semibold text-primary">
                Explore
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-12 space-y-6">
          {solutions.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="relative overflow-hidden rounded-[2.4rem] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(241,247,255,0.78))] p-8 shadow-[0_24px_90px_rgba(15,23,42,0.10)] md:p-10"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(var(--primary)/0.10),_transparent_36%)]" />
              <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">{s.eyebrow}</p>
                  <h3 className="font-display text-4xl tracking-tight text-slate-950">{s.title}</h3>
                  <p className="max-w-2xl text-sm leading-7 text-slate-600">{s.body}</p>
                </div>
                <div className="grid gap-3">
                  {[
                    "Tenant-scoped data boundaries (RLS-first).",
                    "Cohesive components and spacing rhythm.",
                    "Hooks for realtime refresh and instrumentation."
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.6rem] border border-slate-200/70 bg-white/60 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur"
                    >
                      <p className="text-sm font-semibold text-slate-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

