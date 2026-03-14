# Bank AI Copilot

White-label banking SaaS scaffold inspired by Alkami for community banks and credit unions. The generated structure uses Next.js App Router, Tailwind CSS, Supabase, and Vercel-oriented tenancy patterns.

## Highlights

- Multi-tenant data model with `tenant_id` on all entities
- Tenant-themed dashboards and admin SaaS pages
- 16 API group route shells with Zod validation hooks
- Supabase SQL migration and seed data for two demo banks
- Vitest and Playwright test scaffolding

## Monetization

- Tiered SaaS pricing by MAU and enabled modules
- Bank onboarding and migration services
- Tenant analytics dashboards for adoption and CSAT

## Commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Notes

This pass generates the project structure and typed implementation baseline. Supply `.env.local`, install dependencies, and connect a Supabase project to make the app runnable end to end.
