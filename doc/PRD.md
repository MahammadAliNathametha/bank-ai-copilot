# Product Requirements Document - Bank AI Copilot

## 1. Overview

Bank AI Copilot is a white-label SaaS digital banking platform designed for rapid deployment by financial institutions. It provides a premium, themeable UX with deep multi-tenant isolation.

## 2. Target Audience

- Neobanks and Fintech startups.
- Credit Unions and regional banks upgrading their digital presence.
- Enterprise SaaS providers offering embedded finance.

## 3. Core Features

- **Multi-tenancy**: Subdomain-based branding, RLS-backed data isolation.
- **Banking Ledger**: Real-time account balances, transaction history, and funds movement.
- **Service Journeys**: Bill pay, transfers, card management, and loan servicing.
- **Advanced Fintech**: Crypto wallets, AI spending insights, and voice-activated banking.
- **Admin Console**: SaaS metrics, tenant onboarding, and system observability.

## 4. Technical Requirements

- Next.js 15+ with App Router.
- Tailwind CSS for dynamic themeable styling.
- Supabase for Auth, Database (PostgreSQL), and Real-time signals.
- Playwright for E2E testing and Titest for unit testing.
