import Link from "next/link";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Who we serve"
};

const segments = [
  {
    id: "banks",
    title: "Banks",
    body: "For teams that need a modern platform feel without rewriting everything at once. Keep branding flexible and ship modular journeys fast."
  },
  {
    id: "credit-unions",
    title: "Credit unions",
    body: "For member-first experiences that prioritize clarity, speed, and service. Apply tenant-level theming while keeping the same product spine."
  }
] as const;

export default function WhoWeServePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="relative overflow-hidden rounded-[2.6rem] border border-slate-200/70 bg-white/70 p-10 shadow-[0_30px_110px_rgba(15,23,42,0.12)] backdrop-blur md:p-14">
          <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_66%)]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">Who we serve</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            The same product spine. A different brand per institution.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            This scaffold is designed for white-label delivery. Keep the UX consistent while allowing each tenant to express its own tone and visual
            identity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/setup-bank">
              <Button>Configure a demo tenant</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary">See the console</Button>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {segments.map((seg) => (
            <Card key={seg.id} className="space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-500">{seg.title}</p>
              <h2 className="font-display text-4xl tracking-tight text-slate-950">{seg.title} that want modern UX density</h2>
              <p className="text-sm leading-7 text-slate-600">{seg.body}</p>
              <Link href={`#${seg.id}`} className="text-sm font-semibold text-primary">
                Learn more
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {segments.map((seg) => (
            <section
              key={seg.id}
              id={seg.id}
              className="relative overflow-hidden rounded-[2.4rem] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(241,247,255,0.78))] p-8 shadow-[0_24px_90px_rgba(15,23,42,0.10)] md:p-10"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(var(--primary)/0.10),_transparent_38%)]" />
              <div className="relative space-y-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">{seg.title}</p>
                <h3 className="font-display text-4xl tracking-tight text-slate-950">Built to be branded</h3>
                <p className="text-sm leading-7 text-slate-600">{seg.body}</p>
                <ul className="grid gap-3">
                  {[
                    "Tenant-level accent color and logo support.",
                    "Shared components for consistent accessibility.",
                    "Modular nav and routes for phased rollouts."
                  ].map((item) => (
                    <li key={item} className="rounded-[1.4rem] border border-slate-200/70 bg-white/60 px-5 py-4 text-sm font-semibold text-slate-800">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

