import Link from "next/link";

import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/who-we-serve", label: "Who we serve" },
  { href: "/build", label: "Build with us" },
  { href: "/resources", label: "Resources" },
  { href: "/company", label: "Company" }
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary group-hover:text-black shadow-[0_0_20px_rgba(255,153,0,0.1)]">
            <span className="font-display text-xl leading-none font-bold">B</span>
          </span>
          <span className="font-display text-2xl tracking-tight text-white">
            Bank AI Copilot
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-bold tracking-tight text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden sm:block">
            <Button variant="secondary" className="px-6 border-white/10 bg-white/5 hover:bg-white/10 text-slate-200">
              Open console
            </Button>
          </Link>
          <Link href="/setup-bank">
            <Button className="px-6">Request demo</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

