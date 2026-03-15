# Decisions & Architectural Choices

## 1. Multi-Tenancy Architecture

- **Choice**: Database-level isolation using Supabase RLS.
- **Rationale**: Ensures that even if the application code has bugs, one tenant cannot see another's data without a matching `tenant_id` and authorized session.

## 2. White-Label Branding

- **Choice**: CSS Variables + HSL Tokens.
- **Rationale**: Allows for real-time theme updates without recompiling Tailwind. Admin can change `--primary` and `--accent` directly in the database, and the UI adapts instantly.

## 3. Real-Time Engine

- **Choice**: Supabase Realtime (Broadcast + Postgres Changes).
- **Rationale**: Vital for banking UX where balance updates and fraud alerts must be instantaneous. Supports tenant-level filtering on the wire.

## 4. API Security

- **Choice**: `withTenantRoute` HOC.
- **Rationale**: Standardizes audit logging and tenant verification for every single endpoint, preventing "tenant-bleeding" vulnerabilities.

## 5. Frontend Patterns

- **Choice**: TanStack Query + Suspense.
- **Rationale**: Provides smooth, skeletal loading states and robust caching for financial data.
