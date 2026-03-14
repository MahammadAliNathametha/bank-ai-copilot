export type TenantTheme = {
  id: string;
  name: string;
  slug: string;
  primaryHsl: string;
  logoUrl: string;
};

export type Account = {
  id: number;
  name: string;
  type: string;
  balance: number;
};

export type Transaction = {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: "posted" | "pending";
};

export const demoTenants: TenantTheme[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Quantum Bank",
    slug: "quantum-bank",
    primaryHsl: "36.3 100% 50.4%",
    logoUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Gujarat CU",
    slug: "gujarat-cu",
    primaryHsl: "36.3 100% 50.4%",
    logoUrl: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=120&q=80"
  }
];

export const demoAccounts: Account[] = [
  { id: 1, name: "Everyday Checking", type: "checking", balance: 3520.11 },
  { id: 2, name: "Rainy Day Savings", type: "savings", balance: 14220.54 }
];

export const demoTransactions: Transaction[] = [
  { id: 1, description: "Coffee Roasters", category: "Food", amount: -5.5, date: "2026-03-12", status: "posted" },
  { id: 2, description: "Payroll Deposit", category: "Income", amount: 2500, date: "2026-03-11", status: "posted" },
  { id: 3, description: "Utility Bill", category: "Utilities", amount: -124.19, date: "2026-03-10", status: "posted" },
  { id: 4, description: "Card Payment", category: "Credit", amount: -200, date: "2026-03-09", status: "pending" },
  { id: 5, description: "Grocery Market", category: "Food", amount: -86.44, date: "2026-03-08", status: "posted" }
];
