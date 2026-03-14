import Link from "next/link";
import { Building2, Sparkles, Wallet } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata = {
  title: "White-label Digital Banking"
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-8 rounded-[2.6rem] border border-white/5 bg-[#111] p-8 shadow-2xl relative overflow-hidden lg:grid-cols-[1.25fr_0.75fr]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">The digital sales & service platform — rebrandable</p>
            <h1 className="max-w-3xl font-display text-5xl leading-[1.02] tracking-tight md:text-7xl text-white">
              Premium banking UX for institutions that want speed without compromise.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-400">
              A white-label scaffold inspired by modern digital banking patterns: multi-tenant boundaries, themed delivery, realtime refresh, and modular
              journeys.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/landing">
                <Button className="px-8 py-4">See the full landing</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" className="px-8 py-4">Open demo console</Button>
              </Link>
            </div>
          </div>
          <Card className="grid gap-5 relative z-10 bg-[#0a0a0a] border-white/10">
            {[
              { Icon: Building2, label: "Tenant-aware onboarding", desc: "Setup, branding, and isolation rules baked in." },
              { Icon: Wallet, label: "Money movement journeys", desc: "Accounts, transfers, bills, and realtime refresh." },
              { Icon: Sparkles, label: "Signals & engagement", desc: "Insights, analytics, and admin instrumentation." }
            ].map(({ Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-5 p-2 group">
                <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary shadow-[0_10px_30px_rgba(255,153,0,0.1)] group-hover:bg-primary group-hover:text-black transition-all">
                  <Icon className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white tracking-tight">{label}</p>
                  <p className="text-sm leading-6 text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
