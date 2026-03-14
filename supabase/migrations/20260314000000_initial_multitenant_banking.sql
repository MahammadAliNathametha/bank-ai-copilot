create extension if not exists "pgcrypto";

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  primary_color text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key,
  email text unique not null,
  full_name text,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists accounts (
  id bigserial primary key,
  user_id uuid references profiles(id),
  balance decimal not null default 1000,
  type text not null,
  tenant_id uuid not null references tenants(id)
);

create table if not exists transactions (
  id bigserial primary key,
  account_id bigint references accounts(id),
  amount decimal not null,
  description text,
  date timestamptz not null default now(),
  category text,
  tenant_id uuid not null references tenants(id)
);

create table if not exists cards (
  id bigserial primary key,
  user_id uuid references profiles(id),
  number text not null,
  limits jsonb not null default '{}'::jsonb,
  tenant_id uuid not null references tenants(id)
);

create table if not exists loans (
  id bigserial primary key,
  user_id uuid references profiles(id),
  balance decimal not null,
  payments jsonb not null default '[]'::jsonb,
  tenant_id uuid not null references tenants(id)
);

create table if not exists transfers (
  id bigserial primary key,
  from_id bigint references accounts(id),
  to_id bigint references accounts(id),
  amount decimal not null,
  tenant_id uuid not null references tenants(id)
);

create table if not exists payees (
  id bigserial primary key,
  name text not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists bills (
  id bigserial primary key,
  payee_id bigint references payees(id),
  schedule jsonb not null default '{}'::jsonb,
  tenant_id uuid not null references tenants(id)
);

create table if not exists beneficiaries (
  id bigserial primary key,
  name text not null,
  acct text not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists notifications (
  id bigserial primary key,
  message text not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists documents (
  id bigserial primary key,
  url text not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists devices (
  id bigserial primary key,
  fingerprint text not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  device_id bigint references devices(id),
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists fraud_events (
  id bigserial primary key,
  score decimal not null,
  tx_id bigint references transactions(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists compliance_records (
  id bigserial primary key,
  reg text not null,
  status text not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists customer_insights (
  id bigserial primary key,
  insights jsonb not null default '{}'::jsonb,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists marketing_campaigns (
  id bigserial primary key,
  offers jsonb not null default '[]'::jsonb,
  tenant_id uuid not null references tenants(id)
);

create table if not exists support_tickets (
  id bigserial primary key,
  status text not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists audit_logs (
  id bigserial primary key,
  action text not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create table if not exists financial_goals (
  id bigserial primary key,
  target decimal not null,
  progress decimal not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id)
);

create index if not exists idx_accounts_tenant_user on accounts (tenant_id, user_id);
create index if not exists idx_transactions_tenant_account_date on transactions (tenant_id, account_id, date desc);
create index if not exists idx_audit_logs_tenant_user on audit_logs (tenant_id, user_id);
create index if not exists idx_support_tickets_tenant_user on support_tickets (tenant_id, user_id);

alter table profiles enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table audit_logs enable row level security;

drop policy if exists "profiles tenant access" on profiles;
create policy "profiles tenant access" on profiles
  for select using (tenant_id = (select tenant_id from profiles where id = auth.uid()));

drop policy if exists "accounts tenant access" on accounts;
create policy "accounts tenant access" on accounts
  for all using (tenant_id = (select tenant_id from profiles where id = auth.uid()));

drop policy if exists "transactions tenant access" on transactions;
create policy "transactions tenant access" on transactions
  for all using (tenant_id = (select tenant_id from profiles where id = auth.uid()));

insert into tenants (id, name, slug, primary_color)
values
  ('11111111-1111-1111-1111-111111111111', 'Ahmedabad Bank', 'ahmedabad-bank', '215 90% 45%'),
  ('22222222-2222-2222-2222-222222222222', 'Gujarat CU', 'gujarat-cu', '166 72% 32%')
on conflict (id) do nothing;
