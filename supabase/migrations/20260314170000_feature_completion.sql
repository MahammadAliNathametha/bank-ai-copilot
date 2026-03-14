alter table profiles
  add column if not exists two_factor_enabled boolean not null default false,
  add column if not exists biometric_enabled boolean not null default false;

alter table devices
  add column if not exists name text not null default 'Primary Device',
  add column if not exists type text not null default 'mobile',
  add column if not exists os text not null default 'iOS',
  add column if not exists last_seen timestamptz not null default now(),
  add column if not exists location text not null default 'Unknown',
  add column if not exists trusted boolean not null default false,
  add column if not exists created_at timestamptz not null default now();

alter table sessions
  add column if not exists status text not null default 'active',
  add column if not exists created_at timestamptz not null default now();

alter table fraud_events
  add column if not exists user_id uuid references profiles(id),
  add column if not exists type text not null default 'transaction',
  add column if not exists severity text not null default 'medium',
  add column if not exists description text not null default '',
  add column if not exists status text not null default 'reviewed',
  add column if not exists location text not null default '',
  add column if not exists ip text not null default '',
  add column if not exists created_at timestamptz not null default now();

alter table marketing_campaigns
  add column if not exists name text not null default 'New Campaign',
  add column if not exists channel text not null default 'email',
  add column if not exists status text not null default 'scheduled',
  add column if not exists audience integer not null default 0,
  add column if not exists sent integer not null default 0,
  add column if not exists opened integer not null default 0,
  add column if not exists clicked integer not null default 0,
  add column if not exists converted integer not null default 0,
  add column if not exists budget decimal not null default 0,
  add column if not exists spent decimal not null default 0,
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists created_at timestamptz not null default now();

create table if not exists appointments (
  id bigserial primary key,
  user_id uuid references profiles(id),
  location_id bigint references locations(id),
  location_name text not null,
  time_slot timestamptz not null,
  agenda text not null,
  status text not null default 'requested',
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists support_messages (
  id bigserial primary key,
  ticket_id bigint references support_tickets(id) on delete cascade,
  sender text not null,
  message text not null,
  user_id uuid references profiles(id),
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists account_members (
  id bigserial primary key,
  account_id bigint not null references accounts(id) on delete cascade,
  user_id uuid not null references profiles(id),
  role text not null default 'viewer',
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now(),
  unique (account_id, user_id)
);

create table if not exists investment_accounts (
  id bigserial primary key,
  user_id uuid references profiles(id),
  provider text not null,
  account_name text not null,
  balance decimal not null default 0,
  type text not null default 'brokerage',
  status text not null default 'active',
  last_synced_at timestamptz not null default now(),
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists crypto_assets (
  id bigserial primary key,
  symbol text not null,
  name text not null,
  price decimal not null default 0,
  change_24h decimal not null default 0,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists crypto_holdings (
  id bigserial primary key,
  asset_id bigint not null references crypto_assets(id),
  user_id uuid references profiles(id),
  balance decimal not null default 0,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists crypto_trades (
  id bigserial primary key,
  asset_id bigint not null references crypto_assets(id),
  user_id uuid references profiles(id),
  side text not null,
  amount decimal not null,
  price decimal not null,
  total decimal not null,
  status text not null default 'completed',
  executed_at timestamptz not null default now(),
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists wallet_cards (
  id bigserial primary key,
  user_id uuid references profiles(id),
  wallet_type text not null,
  last4 text not null,
  brand text not null,
  status text not null default 'active',
  added_at timestamptz not null default now(),
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists wallet_activity (
  id bigserial primary key,
  user_id uuid references profiles(id),
  merchant text not null,
  method text not null,
  amount decimal not null,
  category text not null,
  occurred_at timestamptz not null default now(),
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists wallet_loyalty (
  id bigserial primary key,
  user_id uuid references profiles(id),
  program text not null,
  points integer not null default 0,
  tier text not null default 'standard',
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists credit_scores (
  id bigserial primary key,
  user_id uuid references profiles(id),
  score integer not null,
  provider text not null,
  status text not null default 'current',
  reported_at timestamptz not null default now(),
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists savings_rules (
  id bigserial primary key,
  user_id uuid references profiles(id),
  name text not null,
  cadence text not null,
  amount decimal not null,
  target decimal not null default 0,
  status text not null default 'active',
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists voice_commands (
  id bigserial primary key,
  user_id uuid references profiles(id),
  command text not null,
  transcript text not null,
  response text not null,
  status text not null default 'processed',
  channel text not null default 'voice',
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists chatbot_messages (
  id bigserial primary key,
  session_id uuid not null default gen_random_uuid(),
  user_id uuid references profiles(id),
  role text not null,
  message text not null,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_appointments_tenant_time on appointments (tenant_id, time_slot desc);
create index if not exists idx_support_messages_ticket on support_messages (ticket_id, created_at desc);
create index if not exists idx_account_members_account on account_members (account_id, user_id);
create index if not exists idx_investment_accounts_tenant on investment_accounts (tenant_id, created_at desc);
create index if not exists idx_crypto_assets_tenant on crypto_assets (tenant_id);
create index if not exists idx_crypto_holdings_user on crypto_holdings (tenant_id, user_id);
create index if not exists idx_crypto_trades_user on crypto_trades (tenant_id, user_id, executed_at desc);
create index if not exists idx_wallet_cards_user on wallet_cards (tenant_id, user_id);
create index if not exists idx_wallet_activity_user on wallet_activity (tenant_id, user_id, occurred_at desc);
create index if not exists idx_wallet_loyalty_user on wallet_loyalty (tenant_id, user_id);
create index if not exists idx_credit_scores_user on credit_scores (tenant_id, user_id, reported_at desc);
create index if not exists idx_savings_rules_user on savings_rules (tenant_id, user_id);
create index if not exists idx_voice_commands_user on voice_commands (tenant_id, user_id, created_at desc);
create index if not exists idx_chatbot_messages_session on chatbot_messages (tenant_id, session_id, created_at desc);
create index if not exists idx_devices_tenant_user on devices (tenant_id, user_id);
create index if not exists idx_fraud_events_tenant on fraud_events (tenant_id, created_at desc);
create index if not exists idx_marketing_campaigns_tenant on marketing_campaigns (tenant_id, created_at desc);
create index if not exists idx_sessions_tenant on sessions (tenant_id, created_at desc);

alter table appointments enable row level security;
alter table support_messages enable row level security;
alter table account_members enable row level security;
alter table investment_accounts enable row level security;
alter table crypto_assets enable row level security;
alter table crypto_holdings enable row level security;
alter table crypto_trades enable row level security;
alter table wallet_cards enable row level security;
alter table wallet_activity enable row level security;
alter table wallet_loyalty enable row level security;
alter table credit_scores enable row level security;
alter table savings_rules enable row level security;
alter table voice_commands enable row level security;
alter table chatbot_messages enable row level security;
alter table devices enable row level security;
alter table sessions enable row level security;
alter table fraud_events enable row level security;
alter table marketing_campaigns enable row level security;

drop policy if exists "appointments tenant access" on appointments;
create policy "appointments tenant access" on appointments
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "support messages tenant access" on support_messages;
create policy "support messages tenant access" on support_messages
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "account members tenant access" on account_members;
create policy "account members tenant access" on account_members
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "investment accounts tenant access" on investment_accounts;
create policy "investment accounts tenant access" on investment_accounts
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "crypto assets tenant access" on crypto_assets;
create policy "crypto assets tenant access" on crypto_assets
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "crypto holdings tenant access" on crypto_holdings;
create policy "crypto holdings tenant access" on crypto_holdings
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "crypto trades tenant access" on crypto_trades;
create policy "crypto trades tenant access" on crypto_trades
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "wallet cards tenant access" on wallet_cards;
create policy "wallet cards tenant access" on wallet_cards
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "wallet activity tenant access" on wallet_activity;
create policy "wallet activity tenant access" on wallet_activity
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "wallet loyalty tenant access" on wallet_loyalty;
create policy "wallet loyalty tenant access" on wallet_loyalty
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "credit scores tenant access" on credit_scores;
create policy "credit scores tenant access" on credit_scores
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "savings rules tenant access" on savings_rules;
create policy "savings rules tenant access" on savings_rules
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "voice commands tenant access" on voice_commands;
create policy "voice commands tenant access" on voice_commands
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "chatbot messages tenant access" on chatbot_messages;
create policy "chatbot messages tenant access" on chatbot_messages
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "devices tenant access" on devices;
create policy "devices tenant access" on devices
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "sessions tenant access" on sessions;
create policy "sessions tenant access" on sessions
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "fraud events tenant access" on fraud_events;
create policy "fraud events tenant access" on fraud_events
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "marketing campaigns tenant access" on marketing_campaigns;
create policy "marketing campaigns tenant access" on marketing_campaigns
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

insert into marketing_campaigns (id, name, channel, status, audience, sent, opened, clicked, converted, budget, spent, start_date, end_date, offers, tenant_id, created_at)
values
  (101, 'Spring Savings Promo', 'push', 'active', 12450, 11800, 4720, 1890, 378, 5000, 3200, '2026-03-01', '2026-03-31', '[]'::jsonb, '11111111-1111-1111-1111-111111111111', now()),
  (201, 'Spring Savings Promo', 'push', 'active', 12450, 11800, 4720, 1890, 378, 5000, 3200, '2026-03-01', '2026-03-31', '[]'::jsonb, '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into appointments (id, user_id, location_id, location_name, time_slot, agenda, status, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', 101, 'Downtown Branch', '2026-03-20 11:00', 'Discuss account options and service upgrades', 'requested', '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', 201, 'Downtown Branch', '2026-03-20 11:00', 'Discuss account options and service upgrades', 'requested', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into investment_accounts (id, user_id, provider, account_name, balance, type, status, last_synced_at, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', 'Apex Clearing', 'Core Brokerage', 18450.22, 'brokerage', 'active', now(), '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', 'Apex Clearing', 'Core Brokerage', 18450.22, 'brokerage', 'active', now(), '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into crypto_assets (id, symbol, name, price, change_24h, tenant_id, created_at)
values
  (101, 'BTC', 'Bitcoin', 91302.47, 6.71, '11111111-1111-1111-1111-111111111111', now()),
  (102, 'ETH', 'Ethereum', 3412.85, 4.23, '11111111-1111-1111-1111-111111111111', now()),
  (201, 'BTC', 'Bitcoin', 91302.47, 6.71, '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into crypto_holdings (id, asset_id, user_id, balance, tenant_id, created_at)
values
  (101, 101, '11111111-1111-1111-1111-111111111112', 0.4821, '11111111-1111-1111-1111-111111111111', now()),
  (201, 201, '22222222-2222-2222-2222-222222222223', 0.4821, '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into wallet_cards (id, user_id, wallet_type, last4, brand, status, added_at, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', 'Apple Pay', '4829', 'Visa', 'active', now(), '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', 'Apple Pay', '4829', 'Visa', 'active', now(), '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into credit_scores (id, user_id, score, provider, status, reported_at, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', 742, 'Equifax', 'current', now(), '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', 742, 'Equifax', 'current', now(), '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into savings_rules (id, user_id, name, cadence, amount, target, status, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', 'Round-ups', 'daily', 12.50, 20000, 'active', '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', 'Round-ups', 'daily', 12.50, 20000, 'active', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;
