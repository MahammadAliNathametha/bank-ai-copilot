# Database Schema - Bank AI Copilot

## 1. Core Entities

- **tenants**: Root of the multi-tenant hierarchy. Stores branding and domain info.
- **profiles**: Extended user data linked to Supabase Auth and a specific tenant.
- **accounts**: Financial containers for balances (Checking, Savings, etc.).
- **transactions**: Individual ledger entries representing money movement.

## 2. Service Entities

- **transfers**: Records of internal money movement between accounts.
- **bills & payees**: Bill payment infrastructure.
- **beneficiaries**: Saved external targets for payments.
- **loans**: Debt management and payment tracking.
- **cards**: Physical and virtual card management with limits.

## 3. Engagement & Signals

- **notifications**: User-specific alerts and system messages.
- **documents**: Statements, tax forms, and secure uploads.
- **marketing_campaigns**: Dynamic offers and promo banners per tenant.

## 4. Security & Compliance

- **devices & sessions**: Device fingerprinting and session tracking.
- **fraud_events**: Audit trail of suspicious activity or flagged transactions.
- **compliance_records**: KYC/AML status tracking.
- **audit_logs**: Immutable record of all system actions.

## 5. Advanced Entities

- **financial_goals**: User-defined savings targets.
- **crypto_holdings**: Integration with digital asset wallets.
- **voice_commands**: Logs of processed natural language interactions.
- **customer_insights**: Summarized behavior and spending patterns.
