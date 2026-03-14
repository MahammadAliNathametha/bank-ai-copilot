import Link from "next/link";

const columns: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Solutions",
    links: [
      { href: "/solutions", label: "Overview" },
      { href: "/solutions#onboarding", label: "Onboarding & account opening" },
      { href: "/solutions#digital", label: "Digital banking" },
      { href: "/solutions#data", label: "Data & engagement" }
    ]
  },
  {
    title: "Who we serve",
    links: [
      { href: "/who-we-serve", label: "Banks" },
      { href: "/who-we-serve#credit-unions", label: "Credit unions" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About" },
      { href: "/company#contact", label: "Contact" }
    ]
  }
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">White-label banking scaffold</p>
            <h2 className="font-display text-3xl tracking-tight text-white">Ship the demo. Keep the tenant boundaries.</h2>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              A multi-tenant SaaS foundation for branded banking experiences — designed to be extended, themed per institution, and verified with clean
              route boundaries.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title} className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">{col.title}</p>
                <ul className="space-y-2 text-sm font-semibold text-slate-300">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href as never} className="transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Bank AI Copilot — demo scaffold</p>
          <p className="uppercase tracking-[0.28em]">Tenant-safe • Brandable • Modular</p>
        </div>
      </div>
    </footer>
  );
}

