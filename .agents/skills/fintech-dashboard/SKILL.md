---
name: fintech-dashboard
description: Build digital banking dashboards including accounts, transactions, transfers, bill pay, and financial insights. Supports multi-tenant/white-label with tenant_id filtering and dynamic themes.
user-invokable: true
---

# Fintech Dashboard Skill

Use this skill when building fintech or digital banking interfaces per Alkami blueprint.

This includes:

- multi-tenant account dashboards (core 1/2/12)
- transaction history with search/filter (core 6)
- transfer flows (core 3)
- bill pay (core 4)
- AI financial insights (advanced 1, innovative AI health scoring)
- mocks for alerts/fraud/carbon tracking (core 14, advanced 5, innovative carbon footprint)

---

# Tech Stack Rules

Framework: Next.js (App Router)  
Language: TypeScript (strict, no any)  
Styling: Tailwind CSS (dynamic vars for white-label, e.g., --primary from env(PRIMARY_COLOR))  
Database: Supabase (queries with tenant_id filter via RLS)  
Charts: Recharts  
Forms: React Hook Form + Zod validation  
State: TanStack Query for data  

---

# Core Features

## Account Dashboard

Display (tenant-filtered):

- current balance with real-time sub (core 2)
- account cards/list (core 1/11)
- recent transactions table (core 6)
- quick actions (transfers/bill pay) (core 3/4)
- personalized offers if balance >1k (advanced 4)

Use Card component for metrics.

## Transactions

Provide:

- searchable/filterable/sortable list (date/desc/category/amount/status) (core 6)
- export CSV (papaparse)
- category-based insights (core 16)

## Transfers

Allow:

- select tenant source acct
- enter recipient/amount
- Zod validate + confirm (core 3)
- real-time balance update on success

## Bill Pay

Stub:

- payee list/management/scheduling (core 4)

## Financial Insights

Generate mocks:

- spending pie chart (Recharts, high on food tip) (advanced 1)
- monthly summaries/savings rate/health score (innovative AI scoring: "Wedding? Save more")
- carbon footprint from spending (innovative)

---

# UI Layout

Mobile-first responsive:

- Sidebar nav (accounts/transfers/insights)
- Top header with logo (BANK_LOGO_URL) + alerts
- Main grid/cards for dashboards  

White-label: bg-[var(--primary)], dynamic env themes.

---

# Component Structure

components/ui/ (shadcn/reusables: Button, Card, Table, Form, Modal)  
components/dashboard/ (AccountCard, TransactionTable, TransferForm, InsightsChart)  
components/accounts/  
components/transactions/  
components/transfers/  
components/insights/  

---

# Best Practices

- Tenant-aware: All Supabase queries .eq('tenant_id', getTenantId())
- Error Handling: Zod forms, ErrorBoundary, log to audit_logs
- Testing: Vitest for isolation (e.g., tenant1 data hidden from tenant2)
- Invoke $agent-browser for E2E dashboard flows
- Comments for stuck: "// Error in query? Check RLS + Zod"