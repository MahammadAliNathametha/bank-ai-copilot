Codex Task: Generate Error-Free White-Label SaaS Banking Platform (Alkami-Inspired, Exact Blueprint + SaaS Multi-Tenancy)

You are a senior SaaS architect specializing in white-label fintech. Generate ERROR-FREE code (strict TS, ESLint, 100% test coverage, Zod validation, no console.errors). Match blueprint EXACTLY (read line-by-line: core features 1-23, advanced 1-14, innovative 12 ideas, 20 entities with exact fields, 16 API groups, MVP scope). Emphasize SAAS WHITE-LABEL: Multi-tenant (banks as tenants, isolated data via tenant_id), customizable branding (logos/colors/domains) for mid-size banks to rebrand seamlessly.

Stack ONLY: Next.js (React/Node), Tailwind CSS (dynamic themes), Supabase (auth/DB/real-time/multi-tenant), Vercel (multi-env deploys). No extras.

SaaS White-Label Core (Per Exec Summary):
- Multi-tenancy: tenant_id UUID in ALL entities (banks' data isolated).
- Branding: Env vars (BANK_LOGO_URL, PRIMARY_COLOR) + dynamic Tailwind (css vars). Admin toggle for bank-specific themes.
- Onboarding: Bank signup → auto-tenant setup, white-label subdomain mock (Vercel redirects).
- Monetization: /admin SaaS dashboard for tiers (users-based pricing mock).

Incorporate Skills:
- fintech-dashboard: All pages with tenant-aware banking UX.
- tailwind-design-system: Reusables (Button, Card, Table, Form, Modal) + dynamic themes (e.g., [color].css var).
- vercel-react-best-practices: API routes/server actions, env/caching, multi-tenant routing/edge functions for themes.
- TDD: Jest/Vitest full suite (e.g., test tenant isolation, transfer balance update).
- Systematic Debugging: Zod schemas + Sentry mock logs, error boundaries + try/catch traces.
- Root Cause Tracing: Log errors to Supabase audit_logs entity with tenant_id.
- Verification Before Completion: Post-gen tests verify CRUD per API group; includes 'npm run test' script that passes.
- When Stuck - Problem-Solving Dispatch: Comments like "// Error in tenant query? Validate Zod schema first; Rerun: generate fixed SQL".
- Additional Skills (from folder): agent-browser (stub browser tool in /support), frontend-design (UI components), collision-zone-thinking (comments on potential conflicts like tenant overlaps), inversion-exercise (test inverted cases e.g., invalid tenant), meta-pattern-recognition (recognize blueprint patterns in code comments), scale-game (mock high-load tests), simplification-cascades (strip non-MVP to stubs), when-stuck (debug comments), research-practices (README research notes), ui-ux-pro-max (enhanced responsive), writing-clearly-and-concisely (clean code/docs), find-skills/skill-creator/skill-installer (stub skill loader in admin).

Step 1: Init & SaaS Config
- Next.js + Tailwind (dynamic: css: { vars: { '--primary': 'env(PRIMARY_COLOR)' } }).
- Install: @supabase/supabase-js, react-hot-toast, recharts, papaparse, react-hook-form, @tanstack/react-query, zod (validation), jspdf (PDF gen), file-saver (download).
- .env.local: SUPABASE_URL, ANON_KEY, DEFAULT_TENANT_ID (mock bank).
- Middleware: Tenant resolver (from subdomain or session).
- next.config.js: Vercel images/static optimization + redirects for white-label (e.g., bank1.yourapp.com → tenant filter).

Step 2: Data Model (Exact 20 Entities + Multi-Tenancy)
- Supabase SQL script: CREATE/ALTER TABLES for ALL with exact fields + tenant_id UUID NOT NULL REFERENCES profiles(tenant_id).
  - Users: Via auth.users + profiles table (id UUID PK REFERENCES auth.users, email TEXT UNIQUE, full_name TEXT, tenant_id UUID, created_at TIMESTAMPTZ DEFAULT NOW()).
  - Accounts: id SERIAL PK, user_id UUID REFERENCES profiles(id), balance DECIMAL DEFAULT 1000, type TEXT, tenant_id UUID NOT NULL.
  - Transactions: id SERIAL PK, account_id INT REFERENCES accounts, amount DECIMAL, description TEXT, date TIMESTAMPTZ DEFAULT NOW(), category TEXT, tenant_id UUID NOT NULL.
  - Cards: id SERIAL PK, user_id UUID REFERENCES profiles, number TEXT, limits JSONB, tenant_id UUID NOT NULL.
  - Loans: id SERIAL PK, user_id UUID REFERENCES profiles, balance DECIMAL, payments JSONB, tenant_id UUID NOT NULL.
  - Transfers: id SERIAL PK, from_id INT REFERENCES accounts, to_id INT REFERENCES accounts, amount DECIMAL, tenant_id UUID NOT NULL.
  - Bills: id SERIAL PK, payee_id INT REFERENCES payees, schedule JSONB, tenant_id UUID NOT NULL.
  - Payees: id SERIAL PK, name TEXT, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Beneficiaries: id SERIAL PK, name TEXT, acct TEXT, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Notifications: id SERIAL PK, message TEXT, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Documents: id SERIAL PK, url TEXT, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Sessions: id UUID PK, device_id INT REFERENCES devices, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Devices: id SERIAL PK, fingerprint TEXT, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Fraud_Events: id SERIAL PK, score DECIMAL, tx_id INT REFERENCES transactions, tenant_id UUID NOT NULL.
  - Compliance_Records: id SERIAL PK, reg TEXT, status TEXT, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Customer_Insights: id SERIAL PK, insights JSONB, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Marketing_Campaigns: id SERIAL PK, offers JSONB, tenant_id UUID NOT NULL.
  - Support_Tickets: id SERIAL PK, status TEXT, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Audit_Logs: id SERIAL PK, action TEXT, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
  - Financial_Goals: id SERIAL PK, target DECIMAL, progress DECIMAL, user_id UUID REFERENCES profiles, tenant_id UUID NOT NULL.
- RLS: Policies filter by auth.uid() AND tenant_id (e.g., USING (tenant_id = (SELECT tenant_id FROM profiles WHERE id = auth.uid()))); admin override for /admin.
- Indexes: On tenant_id + user_id/date/amount (e.g., CREATE INDEX idx_accounts_tenant_user ON accounts (tenant_id, user_id)).
- Seed: 2 tenants (mock banks: "Ahmedabad Bank" + "Gujarat CU"), each with 1 user, $1000 checking acct, 5 trans (e.g., "Coffee -$5.50").

Step 3: API Groups (16 Exact, Tenant-Safe CRUD)
- /api/[group]/route.ts: ALL, with tenant_id from session (Supabase auth).
  - /auth: POST login/signup (auto-assign tenant via trigger), GET session (incl tenant).
  - /users: GET profile, PUT update (tenant-scoped).
  - /accounts: GET list/balance (tenant filter), POST open (mock KYC, assign tenant).
  - /transactions: GET list/search/filter/export (CSV via papaparse, tenant + filters), POST create (validate Zod).
  - /transfers: POST internal/external/ACH (update balances real-time via Supabase sub, tenant cross-check).
  - /payments: POST P2P/wire (mock email/phone, tenant alerts).
  - /bills: GET payees, POST pay/schedule (tenant payees).
  - /cards: GET list, PUT controls/activate/alerts (tenant cards).
  - /loans: GET details/history, POST pay (tenant loans).
  - /documents: POST upload (Supabase storage, tenant buckets), GET statements/PDF mock (link to static or jsPDF).
  - /notifications: GET list, POST customizable alerts (tenant-custom).
  - /insights: GET AI/spending (mock JS agg), POST goals (tenant data agg).
  - /compliance: POST checks (mock), GET records (tenant audits).
  - /admin: GET metrics (SaaS: MAU/churn/tiers per tenant, behavioral analytics), POST monetization stubs.
  - /support: POST tickets/chat (mock bot: simple if/else responses, tenant-specific).
  - /locations: GET ATM/branch (mock geojson, tenant branches).
  - /webhooks: POST for events (e.g., tx.created, tenant-filtered).
- All: JWT via Supabase, Zod input validation, error-free (try/catch → 400/500 JSON), real-time subs with tenant filter + reconnect (supabase.channel('tenant-[id]-changes').on('postgres_changes', { filter: `tenant_id=eq.${tenantId}` }, payload => {...}).subscribe(err => audit_log.error(err, tenantId))), tenant isolation tests.

Step 4: Core Features (1-23, White-Label Impl, Full for Must-Haves/Stubs for Others)
- Pages/Components: Tenant-themed (e.g., <div className="bg-[var(--primary)]">), reusables (Button/Card/Table/Form/Modal), responsive Tailwind mobile-first (sm/md/lg).
  1. /dashboard: Multi-channel acct mgmt (view/history via TanStack Query, tenant data).
  2. Real-time balance: Supabase sub updates UI (tenant channel).
  3. /transfers: Form for internal/external/ACH (Zod val, tenant to-acct).
  4. /bills: Payee mgmt/scheduling (tenant list).
  5. /checkdeposit: File upload + mock OCR (alert "Processed $X via OCR sim"—no Tesseract, tenant acct credit).
  6. /transactions: Search/filter/export CSV (tenant scope).
  7. /statements: PDF mock download/gen (jsPDF tenant-branded, add bank logo from env).
  8. /security: 2FA mock toggle, device list, alerts (tenant devices).
  9. /support: Chat UI (bot escalation stub, tenant-specific responses).
  10. /loans: View/pay (tenant).
  11. /cards: Controls/activation/alerts (tenant).
  12. /finance: Personal finance summaries/insights/charts (Recharts pie, tenant agg).
  13. /locations: Mock GPS map (iframe Google Maps, tenant branches).
  14. /alerts: Custom setup, toasts via hot-toast (tenant-custom).
  15. /p2p: Email/phone form (tenant P2P).
  16. /budget: Category tracking/tools (tenant tracking).
  17. /wire: Form + mock compliance (tenant).
  18. /documents: Upload portal (tenant).
  19. /appointments: Booking calendar stub (tenant calendar).
  20. /business: Role-based access (mock multi-user, tenant).
  21. /tax: Mock 1099 gen (static PDF or jsPDF tenant-branded).
  22. /onboard: Account opening workflow (form + mock verify, tenant signup).
  23. /invest: View history stub (tenant).

Step 5: Advanced Features (1-14, Tenant Mocks)
- 1. /insights/ai: JS spending analysis ("High on food—tip!", tenant patterns).
- 2. Open banking: Stub /api/open aggregate (tenant third-party).
- 3. Biometric: Mock button ("Face ID enabled", tenant security).
- 4. Marketing: Personalized offers in dashboard (if balance>1k, show loan ad, behavior-based tenant).
- 5. Fraud: Threshold alert (> $500? Block mock, tenant ML sim).
- 6. Voice: Stub audio input (tenant commands).
- 7. Crypto: Mock wallet balance (tenant).
- 8. /savings: Round-up button/goals (tenant automation).
- 9. Digital wallet: Provision links (tenant).
- 10. /credit: Mock score 750 + tips (tenant).
- 11. /admin/analytics: Behavioral charts (tenant).
- 12. Compliance: Auto-log actions/reports (tenant).
- 13. /chatbot: Enhanced support AI (mock responses, tenant queries).
- 14. Real-time rails: Mock instant tx (tenant).

Step 6: Innovative Ideas (Pick 3 Tenant Mocks)
- AI health scoring: Dashboard metric (predict "Life event: Wedding? Save more", tenant).
- Gamified savings: Progress bar + "Challenge unlocked!" (tenant leaderboards).
- Carbon tracking: Spending-based CO2 calc + offset button (tenant offsets).

Step 7: SaaS/Other
- /admin/saas: Tiers/pricing mocks, implementation fees stub.
- /admin/metrics: Track MAU/adoption/CSAT/etc. (mock data per tenant).
- README.md: Exec summary, monetization (SaaS tiers/transaction sharing), competitive (vs Alkami/Q2/Backbase—API-first edge), GTM notes (target mid-size banks/credit unions, faster impl/lower TCO), metrics dashboard stub.
- Go-to-market: Landing page stub (/landing: "White-label for community banks").
- White-label demo: /setup-bank form (set logo/color, gen tenant).

Step 8: Error-Free Testing/Deploy
- package.json: Scripts 'lint', 'test' (Jest: 100% coverage incl tenant isolation), 'build' (no errors).
- ErrorBoundary: Global component.
- Vercel: Multi-tenant deploys, white-label previews, vercel.json redirects.
- Verification: Gen 'verify.sh' (runs npm install/test/build).

Step 9: Edge Enhancements (Blueprint Polish)
- PDF/OCR: Mock check deposit OCR (alert processed amt), statements/tax as jsPDF gen (tenant logo via BANK_LOGO_URL).
- Real-Time: Subs with tenant filter + reconnect (supabase.channel(...).subscribe(err => audit_log.error(err, tenantId))).
- Migration: /api/admin/migrate POST (bulk tenant_id update, verify RLS post-run via test).
- Total: Ensure <12k lines; gen includes full folder structure (app/, lib/, components/, tests/, supabase.sql, doc/ with stubs).

Step 10: Project Docs Folder
- Generate doc/ folder with:
  - PRD.md: Product Requirements Doc (Exec Summary + core/advanced features as tables, monetization/GTM).
  - TASKS.md: List MVP tasks (e.g., "Impl /transfers [TODO]").
  - PROGRESS.md: Mock progress (e.g., "Core features: 80% done").
  - BLOCKERS.md: Stub (e.g., "RLS policy errors—resolve with Zod").
  - CHANGELOG.md: Version 1.0: "Initial MVP gen".
  - DECISIONS.md: Key choices (e.g., "Multi-tenant via Supabase RLS for white-label").
  - SCHEMA.md: Markdown tables/diagrams for 20 entities + indexes/RLS.
  - MVP.md: Exact blueprint content (paste provided PDF text/screenshots as Markdown tables/lists).
- Ensure all MDs are readable, <500 lines total.

Output: All files (pages/APIs/SQL/tests/README/doc). Runnable, white-label SaaS per "seamless experiences without investments". Clean UX, per "think beyond, build better".