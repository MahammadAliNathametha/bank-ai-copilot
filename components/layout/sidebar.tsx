"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Wallet, ArrowRightLeft, CreditCard, PieChart,
  Shield, HelpCircle, Activity, Building, Hexagon, Landmark,
  Receipt, FileText, MapPin, Mic, Bitcoin, WalletCards,
  Bell, Calendar, FileBarChart, TrendingUp, ChevronLeft,
  ChevronRight, Users, Settings, Zap, Target, Search,
  Banknote, PiggyBank, UserPlus, Gavel, Megaphone
} from "lucide-react";

interface NavGroup {
  label: string;
  items: NavItemProps[];
}

interface NavItemProps {
  href: Route;
  icon: React.ReactNode;
  tooltip: string;
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { href: "/dashboard" as Route, icon: <LayoutDashboard className="h-[18px] w-[18px]" />, tooltip: "Dashboard" },
      { href: "/accounts" as Route, icon: <Wallet className="h-[18px] w-[18px]" />, tooltip: "Accounts" },
      { href: "/transactions" as Route, icon: <Activity className="h-[18px] w-[18px]" />, tooltip: "Transactions" },
    ],
  },
  {
    label: "Payments",
    items: [
      { href: "/transfers" as Route, icon: <ArrowRightLeft className="h-[18px] w-[18px]" />, tooltip: "Transfers" },
      { href: "/p2p" as Route, icon: <Users className="h-[18px] w-[18px]" />, tooltip: "P2P Send" },
      { href: "/wire" as Route, icon: <Zap className="h-[18px] w-[18px]" />, tooltip: "Wire" },
      { href: "/bills" as Route, icon: <Receipt className="h-[18px] w-[18px]" />, tooltip: "Bills" },
      { href: "/beneficiaries" as Route, icon: <Users className="h-[18px] w-[18px]" />, tooltip: "Beneficiaries" },
      { href: "/instant-payments" as Route, icon: <Zap className="h-[18px] w-[18px]" />, tooltip: "Instant Pay" },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/budget" as Route, icon: <Target className="h-[18px] w-[18px]" />, tooltip: "Budget" },
      { href: "/savings" as Route, icon: <PiggyBank className="h-[18px] w-[18px]" />, tooltip: "Savings" },
      { href: "/invest" as Route, icon: <TrendingUp className="h-[18px] w-[18px]" />, tooltip: "Invest" },
      { href: "/credit" as Route, icon: <CreditCard className="h-[18px] w-[18px]" />, tooltip: "Credit" },
      { href: "/loans" as Route, icon: <Landmark className="h-[18px] w-[18px]" />, tooltip: "Loans" },
    ],
  },
  {
    label: "Digital",
    items: [
      { href: "/crypto" as Route, icon: <Bitcoin className="h-[18px] w-[18px]" />, tooltip: "Crypto" },
      { href: "/wallet" as Route, icon: <WalletCards className="h-[18px] w-[18px]" />, tooltip: "Digital Wallet" },
      { href: "/cards" as Route, icon: <Banknote className="h-[18px] w-[18px]" />, tooltip: "Cards" },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/insights" as Route, icon: <PieChart className="h-[18px] w-[18px]" />, tooltip: "AI Insights" },
      { href: "/statements" as Route, icon: <FileBarChart className="h-[18px] w-[18px]" />, tooltip: "Statements" },
      { href: "/tax" as Route, icon: <Gavel className="h-[18px] w-[18px]" />, tooltip: "Tax Center" },
    ],
  },
  {
    label: "Security",
    items: [
      { href: "/security" as Route, icon: <Shield className="h-[18px] w-[18px]" />, tooltip: "Security" },
      { href: "/alerts" as Route, icon: <Bell className="h-[18px] w-[18px]" />, tooltip: "Alerts" },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/business" as Route, icon: <Building className="h-[18px] w-[18px]" />, tooltip: "Business" },
      { href: "/documents" as Route, icon: <FileText className="h-[18px] w-[18px]" />, tooltip: "Documents" },
      { href: "/checkdeposit" as Route, icon: <FileText className="h-[18px] w-[18px]" />, tooltip: "Check Deposit" },
      { href: "/locations" as Route, icon: <MapPin className="h-[18px] w-[18px]" />, tooltip: "Locations" },
      { href: "/appointments" as Route, icon: <Calendar className="h-[18px] w-[18px]" />, tooltip: "Appointments" },
      { href: "/onboard" as Route, icon: <UserPlus className="h-[18px] w-[18px]" />, tooltip: "Onboarding" },
    ],
  },
  {
    label: "Admin & Tools",
    items: [
      { href: "/admin/analytics" as Route, icon: <Hexagon className="h-[18px] w-[18px]" />, tooltip: "Admin Analytics" },
      { href: "/admin/metrics" as Route, icon: <Activity className="h-[18px] w-[18px]" />, tooltip: "Admin Metrics" },
      { href: "/admin/saas" as Route, icon: <Settings className="h-[18px] w-[18px]" />, tooltip: "SaaS Admin" },
      { href: "/marketing" as Route, icon: <Megaphone className="h-[18px] w-[18px]" />, tooltip: "Marketing" },
      { href: "/chatbot" as Route, icon: <Mic className="h-[18px] w-[18px]" />, tooltip: "AI Assistant" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={`group/sidebar sticky top-0 h-screen flex flex-col border-r border-white/10 bg-[#0a0a0a] py-4 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-50 transition-all duration-300 ${
        expanded ? "w-[200px]" : "w-[64px]"
      }`}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between px-3 mb-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-accent text-white shadow-lg shadow-primary/20">
          <Hexagon className="h-5 w-5" />
        </div>
        {expanded && (
          <span className="ml-2 text-sm font-bold text-white font-display truncate">BankAI</span>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          {expanded ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Search (expanded only) */}
      {expanded && (
        <div className="mx-3 mb-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-500">
            <Search className="h-3 w-3" />
            <span>Search…</span>
          </div>
        </div>
      )}

      {/* Navigation groups */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-1 px-2 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {expanded && (
              <p className="px-2 pt-3 pb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                {group.label}
              </p>
            )}
            {!expanded && group.label !== "Main" && (
              <div className="mx-auto my-2 h-px w-6 bg-white/10" />
            )}
            {group.items.map((item) => (
              <NavItem
                key={item.tooltip}
                {...item}
                active={pathname === item.href || pathname.startsWith(item.href + "/")}
                expanded={expanded}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom: Voice + Support + Admin */}
      <div className="mt-auto space-y-1 px-2 pt-2 border-t border-white/10">
        <NavItem href={"/chatbot" as Route} icon={<Mic className="h-[18px] w-[18px]" />} tooltip="Voice & Chat" active={pathname === "/chatbot"} expanded={expanded} />
        <NavItem href={"/support" as Route} icon={<HelpCircle className="h-[18px] w-[18px]" />} tooltip="Support" active={pathname === "/support"} expanded={expanded} />
        <NavItem href={"/admin" as Route} icon={<Settings className="h-[18px] w-[18px]" />} tooltip="Admin" active={pathname.startsWith("/admin")} expanded={expanded} />
      </div>
    </aside>
  );
}

function NavItem({
  href, icon, tooltip, active = false, expanded = false,
}: NavItemProps & { active?: boolean; expanded?: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 transition-all duration-200 ${
        active
          ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,153,0,0.08)]"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
      title={!expanded ? tooltip : undefined}
    >
      <span className="shrink-0">{icon}</span>
      {expanded && (
        <span className="text-xs font-medium truncate">{tooltip}</span>
      )}
      {active && (
        <div className="absolute -left-2 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_10px_rgba(255,153,0,0.5)]" />
      )}
      {/* Tooltip on hover (collapsed only) */}
      {!expanded && (
        <div className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#1a1a1a] border border-white/10 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity z-[60] shadow-xl">
          {tooltip}
        </div>
      )}
    </Link>
  );
}
