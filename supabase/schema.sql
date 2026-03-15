-- SUPABASE SCHEMA - BANK AI COPILOT
-- PRODUCTION READY MULTI-TENANT BANKING PLATFORM

-- EXTENSIONS
create extension if not exists "pgcrypto";

-- 1. TENANTS (THE ROOT)
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  primary_color text not null default '215 90% 45%',
  secondary_color text not null default '215 90% 15%',
  logo_url text,
  domain text,
  created_at timestamptz not null default now()
);

-- 2. PROFILES (USERS)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  two_factor_enabled boolean not null default false,
  biometric_enabled boolean not null default false,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 3. ACCOUNTS
create table if not exists accounts (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  balance decimal not null default 0,
  type text not null, -- 'checking', 'savings', 'credit'
  status text not null default 'active',
  currency text not null default 'USD',
  tenant_id uuid not null references tenants(id)
);

-- 4. TRANSACTIONS
create table if not exists transactions (
  id bigserial primary key,
  account_id bigint not null references accounts(id) on delete cascade,
  amount decimal not null,
  description text,
  date timestamptz not null default now(),
  category text not null default 'general',
  status text not null default 'completed',
  tenant_id uuid not null references tenants(id)
);

-- 5. CARDS
create table if not exists cards (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  account_id bigint references accounts(id),
  number_last4 text not null,
  expiry_month integer,
  expiry_year integer,
  brand text not null, -- 'visa', 'mastercard'
  type text not null, -- 'debit', 'credit'
  limits jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  tenant_id uuid not null references tenants(id)
);

-- 6. LOANS
create table if not exists loans (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  balance decimal not null,
  principal decimal not null,
  interest_rate decimal not null,
  next_payment_date date,
  payments jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  tenant_id uuid not null references tenants(id)
);

-- 7. TRANSFERS
create table if not exists transfers (
  id bigserial primary key,
  from_id bigint not null references accounts(id),
  to_id bigint not null references accounts(id),
  amount decimal not null,
  description text,
  executed_at timestamptz not null default now(),
  tenant_id uuid not null references tenants(id)
);

-- 8. PAYEES
create table if not exists payees (
  id bigserial primary key,
  name text not null,
  account_number text,
  routing_number text,
  user_id uuid not null references profiles(id) on delete cascade,
  tenant_id uuid not null references tenants(id)
);

-- 9. BILLS
create table if not exists bills (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  payee_id bigint not null references payees(id),
  amount decimal not null,
  due_date date not null,
  schedule jsonb not null default '{}'::jsonb,
  status text not null default 'unpaid',
  tenant_id uuid not null references tenants(id)
);

-- 10. BENEFICIARIES
create table if not exists beneficiaries (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  acct text not null,
  bank_name text,
  status text not null default 'active',
  tenant_id uuid not null references tenants(id)
);

-- 11. NOTIFICATIONS
create table if not exists notifications (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'info',
  read_at timestamptz,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 12. DOCUMENTS
create table if not exists documents (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  url text not null,
  type text not null, -- 'statement', 'tax_form'
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 13. DEVICES
create table if not exists devices (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  fingerprint text not null,
  name text not null default 'Primary Device',
  type text not null default 'mobile',
  os text not null default 'unknown',
  last_seen timestamptz not null default now(),
  trusted boolean not null default false,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 14. SESSIONS
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  device_id bigint references devices(id),
  ip_address text,
  status text not null default 'active',
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 15. FRAUD_EVENTS
create table if not exists fraud_events (
  id bigserial primary key,
  user_id uuid references profiles(id) on delete set null,
  tx_id bigint references transactions(id),
  score decimal not null,
  type text not null default 'transaction',
  severity text not null default 'medium',
  description text,
  status text not null default 'pending',
  location text,
  ip text,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 16. COMPLIANCE_RECORDS
create table if not exists compliance_records (
  id bigserial primary key,
  user_id uuid references profiles(id) on delete cascade,
  reg text not null, -- 'KYC', 'AML'
  status text not null default 'pending',
  details jsonb not null default '{}'::jsonb,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 17. CUSTOMER_INSIGHTS
create table if not exists customer_insights (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  insights jsonb not null default '{}'::jsonb, -- spending patterns, risk scores
  tenant_id uuid not null references tenants(id),
  updated_at timestamptz not null default now()
);

-- 18. MARKETING_CAMPAIGNS
create table if not exists marketing_campaigns (
  id bigserial primary key,
  name text not null,
  channel text not null default 'email',
  status text not null default 'scheduled',
  offers jsonb not null default '[]'::jsonb,
  budget decimal not null default 0,
  spent decimal not null default 0,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 19. SUPPORT_TICKETS
create table if not exists support_tickets (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  subject text not null,
  status text not null default 'open',
  priority text not null default 'medium',
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 20. AUDIT_LOGS
create table if not exists audit_logs (
  id bigserial primary key,
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- 21. FINANCIAL_GOALS
create table if not exists financial_goals (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  target decimal not null,
  progress decimal not null default 0,
  deadline date,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

-- INDEXES FOR ALL TABLES (tenant_id, user_id, date, amount)
create index if not exists idx_profiles_tenant on profiles (tenant_id);
create index if not exists idx_accounts_tenant_user on accounts (tenant_id, user_id);
create index if not exists idx_transactions_tenant_account_date on transactions (tenant_id, account_id, date desc);
create index if not exists idx_transactions_amount on transactions (amount);
create index if not exists idx_cards_tenant_user on cards (tenant_id, user_id);
create index if not exists idx_loans_tenant_user on loans (tenant_id, user_id);
create index if not exists idx_transfers_tenant on transfers (tenant_id);
create index if not exists idx_bills_tenant_user on bills (tenant_id, user_id);
create index if not exists idx_notifications_tenant_user on notifications (tenant_id, user_id, created_at desc);
create index if not exists idx_documents_tenant_user on documents (tenant_id, user_id);
create index if not exists idx_devices_tenant_user on devices (tenant_id, user_id);
create index if not exists idx_sessions_tenant_user on sessions (tenant_id, user_id);
create index if not exists idx_fraud_tenant on fraud_events (tenant_id, created_at desc);
create index if not exists idx_audit_logs_tenant_date on audit_logs (tenant_id, created_at desc);

-- RLS POLICIES (Tenant Isolation)
create or replace function get_user_tenant() returns uuid as $$
  select tenant_id from profiles where id = auth.uid();
$$ language sql stable security definer;

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table cards enable row level security;
alter table loans enable row level security;
alter table transfers enable row level security;
alter table bills enable row level security;
alter table payees enable row level security;
alter table beneficiaries enable row level security;
alter table notifications enable row level security;
alter table documents enable row level security;
alter table devices enable row level security;
alter table sessions enable row level security;
alter table fraud_events enable row level security;
alter table compliance_records enable row level security;
alter table customer_insights enable row level security;
alter table marketing_campaigns enable row level security;
alter table support_tickets enable row level security;
alter table audit_logs enable row level security;
alter table financial_goals enable row level security;

-- Example policy for all tables
do $$
declare
  t text;
begin
  for t in (select table_name from information_schema.tables where table_schema = 'public' and table_name not in ('tenants'))
  loop
    execute format('drop policy if exists "tenant_isolation" on %I', t);
    execute format('create policy "tenant_isolation" on %I for all using (tenant_id = get_user_tenant())', t);
  end loop;
end $$;

-- Admin bypass (simplified for MVP)
create policy "admin_view_tenants" on tenants for select using (true);
