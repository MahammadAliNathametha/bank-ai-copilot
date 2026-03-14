import Link from "next/link";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeroVisual } from "@/components/marketing/hero-visual";

export const metadata = {
  title: "Landing"
};

export default function MarketingLandingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="relative overflow-hidden bg-[linear-gradient(120deg,hsl(221_82%_18%),hsl(214_88%_32%)_50%,hsl(198_88%_34%))]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(56,189,248,0.35),transparent_38%),radial-gradient(circle_at_84%_28%,rgba(34,211,238,0.18),transparent_44%),radial-gradient(circle_at_50%_100%,rgba(2,132,199,0.25),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_top,black,transparent_70%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="relative z-10 space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-sky-100/80">
              Anticipatory banking, white-labeled
              <span className="h-1 w-1 rounded-full bg-sky-200/70" />
              Tenant-safe by design
            </div>

            <h1 className="max-w-xl font-display text-5xl leading-[1.02] tracking-tight text-white sm:text-6xl">
              A digital banking shell that feels premium on day one.
            </h1>

            <p className="max-w-xl text-lg leading-8 text-sky-100/80">
              Launch a multi-tenant experience for community institutions: modern onboarding, money movement, and insights — with branding controls that
              adapt per bank.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/setup-bank">
                <Button className="bg-white text-slate-900 shadow-[0_18px_50px_rgba(2,132,199,0.25)] hover:bg-white/95">
                  Set up a demo tenant
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="border border-white/12 bg-white/5 text-white hover:bg-white/10">
                  Explore the console
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 pt-6 sm:grid-cols-3">
              {[
                { k: "Onboarding", v: "Retail & business flows that convert." },
                { k: "Digital banking", v: "Accounts, transfers, bills, insights." },
                { k: "Data & marketing", v: "Signals that surface next actions." }
              ].map((item) => (
                <div key={item.k} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/60">{item.k}</p>
                  <p className="mt-3 text-sm leading-6 text-sky-50/85">{item.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 py-6 lg:py-0">
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-12 px-6 py-14">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">Platform outcomes</p>
            <h2 className="font-display text-4xl tracking-tight">Convert faster. Operate safer. Grow relationships.</h2>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              This scaffold is built for tenant isolation, modern UX density, and the kinds of modules banks ask for first — without locking you into a
              single-brand look.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { stat: "3×", label: "faster onboarding moments" },
              { stat: "85%", label: "workflow automation potential" },
              { stat: "19%", label: "uplift from targeted engagement" }
            ].map((item) => (
              <Card key={item.label} className="bg-white/80">
                <p className="font-display text-4xl text-slate-900">{item.stat}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">Tenant isolation</p>
            <h3 className="font-display text-2xl">RLS-first data boundaries</h3>
            <p className="text-sm leading-7 text-slate-600">Every query key and realtime event can be scoped by tenant_id, so demos don’t leak data.</p>
          </Card>
          <Card className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">White-label theming</p>
            <h3 className="font-display text-2xl">Brand controls per institution</h3>
            <p className="text-sm leading-7 text-slate-600">Logo, accent colors, and tone can vary per tenant without forking layouts.</p>
          </Card>
          <Card className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">Composable modules</p>
            <h3 className="font-display text-2xl">Start with what matters</h3>
            <p className="text-sm leading-7 text-slate-600">Payments, transfers, alerts, insights, and admin analytics are ready to connect.</p>
          </Card>
        </div>

        <div className="relative overflow-hidden rounded-[2.4rem] border border-stone-950/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(245,239,231,0.78))] p-8 shadow-[0_26px_80px_rgba(62,46,25,0.14)] md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[radial-gradient(circle_at_top,rgba(2,132,199,0.18),transparent_62%)]" />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">Ready to demo</p>
              <h2 className="font-display text-4xl tracking-tight">Spin up a bank experience in minutes.</h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                Create a tenant, set the brand accent, and jump straight into dashboards and money movement flows.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/setup-bank">
                <Button>Configure tenant branding</Button>
              </Link>
              <Link href="/admin/saas">
                <Button variant="secondary">View SaaS admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
