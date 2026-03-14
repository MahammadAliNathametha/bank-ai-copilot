# SCHEMA

## Multi-Tenant Model

Every business entity includes `tenant_id UUID NOT NULL`. RLS policies scope data access to the authenticated profile's tenant, with an admin override path for SaaS dashboards.

## Entities

| Entity | Key Fields |
|---|---|
| profiles | id, email, full_name, tenant_id, created_at |
| accounts | id, user_id, balance, type, tenant_id |
| transactions | id, account_id, amount, description, date, category, tenant_id |
| cards | id, user_id, number, limits, tenant_id |
| loans | id, user_id, balance, payments, tenant_id |
| transfers | id, from_id, to_id, amount, tenant_id |
| bills | id, payee_id, schedule, tenant_id |
| payees | id, name, user_id, tenant_id |
| beneficiaries | id, name, acct, user_id, tenant_id |
| notifications | id, message, user_id, tenant_id |
| documents | id, url, user_id, tenant_id |
| sessions | id, device_id, user_id, tenant_id |
| devices | id, fingerprint, user_id, tenant_id |
| fraud_events | id, score, tx_id, tenant_id |
| compliance_records | id, reg, status, user_id, tenant_id |
| customer_insights | id, insights, user_id, tenant_id |
| marketing_campaigns | id, offers, tenant_id |
| support_tickets | id, status, user_id, tenant_id |
| audit_logs | id, action, user_id, tenant_id |
| financial_goals | id, target, progress, user_id, tenant_id |
| appointments | id, user_id, location_name, time_slot, agenda, status, tenant_id |
| support_messages | id, ticket_id, sender, message, tenant_id |
| account_members | id, account_id, user_id, role, tenant_id |
| investment_accounts | id, user_id, provider, account_name, balance, type, status, tenant_id |
| crypto_assets | id, symbol, name, price, change_24h, tenant_id |
| crypto_holdings | id, asset_id, user_id, balance, tenant_id |
| crypto_trades | id, asset_id, user_id, side, amount, price, total, status, tenant_id |
| wallet_cards | id, user_id, wallet_type, last4, brand, status, added_at, tenant_id |
| wallet_activity | id, user_id, merchant, method, amount, category, occurred_at, tenant_id |
| wallet_loyalty | id, user_id, program, points, tier, tenant_id |
| credit_scores | id, user_id, score, provider, status, reported_at, tenant_id |
| savings_rules | id, user_id, name, cadence, amount, target, status, tenant_id |
| voice_commands | id, user_id, command, transcript, response, status, tenant_id |
| chatbot_messages | id, session_id, user_id, role, message, tenant_id |

## Indexes

- `accounts(tenant_id, user_id)`
- `transactions(tenant_id, account_id, date)`
- `audit_logs(tenant_id, user_id)`
- `support_tickets(tenant_id, user_id)`

## Live Status

- [2026-03-14 13:53] Applied `20260314000000_initial_multitenant_banking.sql` to the configured Supabase project.
- Verified REST visibility for `tenants`, `profiles`, `accounts`, `transactions`, `transfers`, `payees`, `bills`, `support_tickets`, `notifications`, and `documents`.
- Verified direct Postgres visibility for all 21 expected public tables through the configured pooler `DATABASE_URL`.
- [2026-03-14 14:09] Applied `20260314140500_live_dashboard_contracts.sql` to add the fields needed by the current API/UI contracts and seed baseline tenant records for the live dashboard.
- [2026-03-14 14:32] Applied `20260314144000_long_tail_live_resources.sql` to create live tables for payments, admin metrics, locations, open connections, and webhooks, and to extend the loan/compliance contract fields used by the remaining API routes.
- [2026-03-14 15:19] Wired frontend realtime subscriptions for `accounts`, `transactions`, `transfers`, and `insights` so Supabase `postgres_changes` events invalidate React Query caches in the primary balance and ledger views.
- [2026-03-14 15:23] Wired the documents API to upload files into the Supabase Storage bucket `bank-documents` by default, using tenant-scoped object paths before persisting the resulting document URL in the `documents` table.
- [2026-03-14 15:27] Added a server-side check-deposit analysis flow that persists uploaded check images to storage, writes a `documents` row, writes a `transactions` row with `pending` or `posted` status based on scan confidence, and only updates `accounts.balance` automatically when the simulated OCR result clears review.
- [2026-03-14 21:24] Added `20260314170000_feature_completion.sql` to expand the schema with marketing, appointments, multi-user access, investments, crypto, wallet, credit score, savings automation, voice banking, and chatbot messaging tables plus security and fraud fields.
- [2026-03-14 21:42] Applied `20260314170000_feature_completion.sql` to the live Supabase project.

## Follow-up Contract Fields

- `profiles.role`
- `accounts.name`, `accounts.currency`, `accounts.created_at`
- `transactions.status`
- `transfers.method`, `transfers.status`, `transfers.created_at`
- `bills.payee_name`, `bills.amount`, `bills.status`, `bills.created_at`
- `cards.last4`, `cards.status`, `cards.alerts_enabled`, `cards.created_at`
- `documents.type`, `documents.status`, `documents.created_at`
- `notifications.channel`, `notifications.status`, `notifications.created_at`
- `customer_insights.title`, `customer_insights.score`, `customer_insights.summary`, `customer_insights.created_at`
- `support_tickets.subject`, `support_tickets.message`, `support_tickets.created_at`
- `sessions.status`, `sessions.created_at`
- `profiles.two_factor_enabled`, `profiles.biometric_enabled`
- `devices.name`, `devices.type`, `devices.os`, `devices.last_seen`, `devices.location`, `devices.trusted`, `devices.created_at`
- `fraud_events.user_id`, `fraud_events.type`, `fraud_events.severity`, `fraud_events.description`, `fraud_events.status`, `fraud_events.location`, `fraud_events.ip`, `fraud_events.created_at`
- `marketing_campaigns.name`, `marketing_campaigns.channel`, `marketing_campaigns.status`, `marketing_campaigns.audience`, `marketing_campaigns.sent`, `marketing_campaigns.opened`, `marketing_campaigns.clicked`, `marketing_campaigns.converted`, `marketing_campaigns.budget`, `marketing_campaigns.spent`, `marketing_campaigns.start_date`, `marketing_campaigns.end_date`, `marketing_campaigns.created_at`

## Long-tail Live Tables

- `payments`
- `admin_metrics`
- `locations`
- `open_connections`
- `webhooks`
- `appointments`
- `support_messages`
- `account_members`
- `investment_accounts`
- `crypto_assets`
- `crypto_holdings`
- `crypto_trades`
- `wallet_cards`
- `wallet_activity`
- `wallet_loyalty`
- `credit_scores`
- `savings_rules`
- `voice_commands`
- `chatbot_messages`
