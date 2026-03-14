"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, ArrowRightLeft, CreditCard, PieChart, Shield, HelpCircle, Activity, Building, Hexagon } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-[72px] flex flex-col items-center border-r border-white/10 bg-[#0a0a0a] py-6 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-50">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-accent text-white shadow-lg shadow-primary/20">
        <Hexagon className="h-6 w-6" />
      </div>
      
      <nav className="flex flex-1 flex-col gap-4">
        <NavItem href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} tooltip="Dashboard" active={pathname === "/dashboard"} />
        <NavItem href="/accounts" icon={<Wallet className="h-5 w-5" />} tooltip="Accounts" active={pathname === "/accounts"} />
        <NavItem href="/transactions" icon={<Activity className="h-5 w-5" />} tooltip="Transactions" active={pathname === "/transactions"} />
        <NavItem href="/transfers" icon={<ArrowRightLeft className="h-5 w-5" />} tooltip="Transfers" active={pathname === "/transfers"} />
        <NavItem href="/bills" icon={<CreditCard className="h-5 w-5" />} tooltip="Bills" active={pathname === "/bills"} />
        <NavItem href="/insights" icon={<PieChart className="h-5 w-5" />} tooltip="Insights" active={pathname === "/insights"} />
        <NavItem href="/business" icon={<Building className="h-5 w-5" />} tooltip="Business" active={pathname === "/business"} />
        <NavItem href="/security" icon={<Shield className="h-5 w-5" />} tooltip="Security" active={pathname === "/security"} />
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <NavItem href="/support" icon={<HelpCircle className="h-5 w-5" />} tooltip="Support" active={pathname === "/support"} />
      </div>
    </aside>
  );
}

function NavItem({ href, icon, tooltip, active = false }: { href: Route; icon: React.ReactNode; tooltip: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
        active 
          ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,153,0,0.1)]" 
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
      title={tooltip}
    >
      {icon}
      {active && (
        <div className="absolute -left-[14px] top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_10px_rgba(255,153,0,0.5)]" />
      )}
    </Link>
  );
}
