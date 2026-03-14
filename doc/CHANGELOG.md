# CHANGELOG

## 2026-03-14

- Initialized a white-label banking SaaS project scaffold with Next.js, Tailwind, Supabase helpers, API route shells, page shells, tests, and documentation.
- Added multi-tenant route groups, reusable UI primitives, tenant resolver services, Vitest/Playwright config, and an initial Supabase migration for 20 banking entities.
- Replaced placeholder API responses with tenant-safe CRUD handlers backed by a shared in-memory tenant store, Zod validation, transfer/loan business logic, and uniform JSON error handling.
- Added route-level tenant isolation tests, corrected lint/typecheck/build configuration, and verified the full local toolchain is green.
- Replaced shell pages with API-backed dashboard workspaces for accounts, transactions, transfers, bills, insights, security, and support, using TanStack Query, Suspense fallbacks, and reusable finance UI sections.
- Added a dedicated `tsconfig.typecheck.json` so standalone typechecking stays green even when Next.js regenerates route types during build.
- Added `.env.local`, a Supabase admin client helper, and a `check:supabase` script to validate live schema readiness before swapping off the in-memory store.
- Updated `.env.local` to point at the latest Supabase session pooler host supplied during live database connection debugging.
- Applied `supabase/migrations/20260314000000_initial_multitenant_banking.sql` to the configured Supabase project and confirmed the expected banking tables are now available through both REST and direct Postgres access.
- Added `supabase/migrations/20260314140500_live_dashboard_contracts.sql` to align the live schema with the current dashboard/API contracts, enable RLS on the newly used tables, and seed baseline tenant data.
- Added a Supabase-backed banking data adapter with mock fallback for tests and migrated the active dashboard/security/support/auth routes off the in-memory store.
- Added `supabase/migrations/20260314144000_long_tail_live_resources.sql` to create the remaining live API tables, extend `loans` and `compliance_records`, enable RLS, and seed baseline records.
- Migrated the remaining production API handlers off the mock store so `app/api/*` now resolves through the live Supabase adapter.
- Replaced the `FeaturePage` shells for documents, alerts, loans, and locations with live React Query workspaces that consume the migrated APIs and expose mutation flows where supported.
- Replaced the `FeaturePage` shells for cards, statements, p2p, admin metrics, and admin analytics with live React Query workspaces tied to the existing cards, payments, admin, documents, and transactions APIs.
- Replaced the `FeaturePage` shells for tax, credit, savings, and appointments with live workspaces grounded in current APIs rather than introducing new backend domains prematurely.
- Replaced the `FeaturePage` shells for budget, onboard, and check deposit with live workspaces by composing existing APIs instead of leaving those flows blocked behind missing bespoke backends.
- Replaced the last remaining `FeaturePage` shells for business, invest, chatbot, wire, and admin SaaS with live workspaces grounded in the existing users, accounts, payments, compliance, support, admin, transactions, and insights APIs.
- Replaced the last route-level `FeaturePage` shells for finance, AI insights, signup, and setup-bank with working workspaces, leaving `FeaturePage` only as a shared component rather than an active page implementation.
- Added a real migration-status service and replaced the `/api/admin/migrate` stub with status and refresh responses based on discovered SQL migrations and current environment readiness, then surfaced that state in the admin SaaS workspace.
- Added a client-side Supabase realtime hook that subscribes to Postgres changes for `accounts`, `transactions`, `transfers`, and `insights`, memoizes the browser client, and invalidates the corresponding React Query families used by the dashboard, finance, accounts, transfers, and transactions views.
- Added a Supabase Storage upload service, extended `/api/documents` to accept multipart file uploads, and updated the documents and check deposit workspaces to submit real files instead of raw URL placeholders.
- Added a dedicated `/api/checkdeposit` route and OCR-style analysis service that derives scan confidence, payer/routing hints, and manual-review gating before releasing deposited funds or marking the uploaded check artifact ready.
- Redesigned the shared dashboard shell, sidebar, hero sections, cards, and overview panels with a more intentional editorial/private-bank visual language while preserving the existing Tailwind-based architecture.
- Added `OPENAI_API_KEY` to the local environment scaffold and typings, without persisting any user-pasted secret into versioned files.
- Changed the global Codex CLI default model in `/home/bacancy/.codex/config.toml` from `gpt-5.4` back to `gpt-5.3-codex` at the user's request.
