alter table profiles
  add column if not exists role text not null default 'member';

alter table accounts
  add column if not exists name text not null default 'Primary Account',
  add column if not exists currency text not null default 'USD',
  add column if not exists created_at timestamptz not null default now();

alter table transactions
  add column if not exists status text not null default 'posted';

alter table transfers
  add column if not exists method text not null default 'internal',
  add column if not exists status text not null default 'queued',
  add column if not exists created_at timestamptz not null default now();

alter table bills
  add column if not exists payee_name text not null default 'Payee',
  add column if not exists amount decimal not null default 0,
  add column if not exists status text not null default 'scheduled',
  add column if not exists created_at timestamptz not null default now();

alter table cards
  add column if not exists last4 text not null default '0000',
  add column if not exists status text not null default 'inactive',
  add column if not exists alerts_enabled boolean not null default true,
  add column if not exists created_at timestamptz not null default now();

alter table documents
  add column if not exists type text not null default 'statement',
  add column if not exists status text not null default 'processing',
  add column if not exists created_at timestamptz not null default now();

alter table notifications
  add column if not exists channel text not null default 'push',
  add column if not exists status text not null default 'active',
  add column if not exists created_at timestamptz not null default now();

alter table customer_insights
  add column if not exists title text not null default 'Financial insight',
  add column if not exists score integer not null default 0,
  add column if not exists summary text not null default '',
  add column if not exists created_at timestamptz not null default now();

alter table support_tickets
  add column if not exists subject text not null default 'Support request',
  add column if not exists message text not null default '',
  add column if not exists created_at timestamptz not null default now();

alter table sessions
  add column if not exists status text not null default 'active',
  add column if not exists created_at timestamptz not null default now();

alter table bills enable row level security;
alter table cards enable row level security;
alter table documents enable row level security;
alter table notifications enable row level security;
alter table customer_insights enable row level security;
alter table support_tickets enable row level security;
alter table transfers enable row level security;
alter table sessions enable row level security;

drop policy if exists "bills tenant access" on bills;
create policy "bills tenant access" on bills
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "cards tenant access" on cards;
create policy "cards tenant access" on cards
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "documents tenant access" on documents;
create policy "documents tenant access" on documents
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "notifications tenant access" on notifications;
create policy "notifications tenant access" on notifications
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "customer insights tenant access" on customer_insights;
create policy "customer insights tenant access" on customer_insights
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "support tickets tenant access" on support_tickets;
create policy "support tickets tenant access" on support_tickets
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "transfers tenant access" on transfers;
create policy "transfers tenant access" on transfers
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "sessions tenant access" on sessions;
create policy "sessions tenant access" on sessions
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

insert into profiles (id, email, full_name, role, tenant_id, created_at)
values
  ('11111111-1111-1111-1111-111111111112', 'member@ahmedabadbank.test', 'Ahmedabad Bank Member', 'member', '11111111-1111-1111-1111-111111111111', now()),
  ('22222222-2222-2222-2222-222222222223', 'member@gujaratcu.test', 'Gujarat CU Member', 'member', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  tenant_id = excluded.tenant_id;

insert into accounts (id, user_id, name, balance, type, currency, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', 'Everyday Checking', 3520.11, 'checking', 'USD', '11111111-1111-1111-1111-111111111111', now()),
  (102, '11111111-1111-1111-1111-111111111112', 'Rainy Day Savings', 14220.54, 'savings', 'USD', '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', 'Everyday Checking', 3520.11, 'checking', 'USD', '22222222-2222-2222-2222-222222222222', now()),
  (202, '22222222-2222-2222-2222-222222222223', 'Rainy Day Savings', 14220.54, 'savings', 'USD', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into transactions (id, account_id, amount, description, date, category, status, tenant_id)
values
  (1001, 101, -5.50, 'Coffee Roasters', '2026-03-12T00:00:00.000Z', 'Food', 'posted', '11111111-1111-1111-1111-111111111111'),
  (1002, 101, 2500.00, 'Payroll Deposit', '2026-03-11T00:00:00.000Z', 'Income', 'posted', '11111111-1111-1111-1111-111111111111'),
  (1003, 101, -124.19, 'Utility Bill', '2026-03-10T00:00:00.000Z', 'Utilities', 'posted', '11111111-1111-1111-1111-111111111111'),
  (1004, 101, -200.00, 'Card Payment', '2026-03-09T00:00:00.000Z', 'Credit', 'pending', '11111111-1111-1111-1111-111111111111'),
  (1005, 101, -86.44, 'Grocery Market', '2026-03-08T00:00:00.000Z', 'Food', 'posted', '11111111-1111-1111-1111-111111111111'),
  (2001, 201, -5.50, 'Coffee Roasters', '2026-03-12T00:00:00.000Z', 'Food', 'posted', '22222222-2222-2222-2222-222222222222'),
  (2002, 201, 2500.00, 'Payroll Deposit', '2026-03-11T00:00:00.000Z', 'Income', 'posted', '22222222-2222-2222-2222-222222222222'),
  (2003, 201, -124.19, 'Utility Bill', '2026-03-10T00:00:00.000Z', 'Utilities', 'posted', '22222222-2222-2222-2222-222222222222'),
  (2004, 201, -200.00, 'Card Payment', '2026-03-09T00:00:00.000Z', 'Credit', 'pending', '22222222-2222-2222-2222-222222222222'),
  (2005, 201, -86.44, 'Grocery Market', '2026-03-08T00:00:00.000Z', 'Food', 'posted', '22222222-2222-2222-2222-222222222222')
on conflict (id) do nothing;

insert into payees (id, name, user_id, tenant_id)
values
  (101, 'Electric Co', '11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111'),
  (201, 'Electric Co', '22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222')
on conflict (id) do nothing;

insert into bills (id, payee_id, payee_name, amount, schedule, status, tenant_id, created_at)
values
  (101, 101, 'Electric Co', 124.19, '{"label":"monthly"}'::jsonb, 'scheduled', '11111111-1111-1111-1111-111111111111', now()),
  (201, 201, 'Electric Co', 124.19, '{"label":"monthly"}'::jsonb, 'scheduled', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into cards (id, user_id, number, last4, limits, status, alerts_enabled, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', '****4242', '4242', '{}'::jsonb, 'active', true, '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', '****4242', '4242', '{}'::jsonb, 'active', true, '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into documents (id, user_id, url, type, status, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', '/docs/statement.pdf', 'statement', 'ready', '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', '/docs/statement.pdf', 'statement', 'ready', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into notifications (id, user_id, message, channel, status, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', 'Large transaction alert', 'push', 'active', '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', 'Large transaction alert', 'push', 'active', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into customer_insights (id, insights, user_id, title, score, summary, tenant_id, created_at)
values
  (101, '{"theme":"savings-health"}'::jsonb, '11111111-1111-1111-1111-111111111112', 'Savings health', 86, 'You are on track this month.', '11111111-1111-1111-1111-111111111111', now()),
  (201, '{"theme":"savings-health"}'::jsonb, '22222222-2222-2222-2222-222222222223', 'Savings health', 86, 'You are on track this month.', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into support_tickets (id, status, subject, message, user_id, tenant_id, created_at)
values
  (101, 'open', 'Card dispute', 'Please review my dispute.', '11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', now()),
  (201, 'open', 'Card dispute', 'Please review my dispute.', '22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into sessions (id, user_id, tenant_id, status, created_at)
values
  ('11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'active', now()),
  ('22222222-2222-2222-2222-222222222224', '22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'active', now())
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('accounts', 'id'), greatest((select coalesce(max(id), 1) from accounts), 1), true);
select setval(pg_get_serial_sequence('transactions', 'id'), greatest((select coalesce(max(id), 1) from transactions), 1), true);
select setval(pg_get_serial_sequence('transfers', 'id'), greatest((select coalesce(max(id), 1) from transfers), 1), true);
select setval(pg_get_serial_sequence('payees', 'id'), greatest((select coalesce(max(id), 1) from payees), 1), true);
select setval(pg_get_serial_sequence('bills', 'id'), greatest((select coalesce(max(id), 1) from bills), 1), true);
select setval(pg_get_serial_sequence('cards', 'id'), greatest((select coalesce(max(id), 1) from cards), 1), true);
select setval(pg_get_serial_sequence('documents', 'id'), greatest((select coalesce(max(id), 1) from documents), 1), true);
select setval(pg_get_serial_sequence('notifications', 'id'), greatest((select coalesce(max(id), 1) from notifications), 1), true);
select setval(pg_get_serial_sequence('customer_insights', 'id'), greatest((select coalesce(max(id), 1) from customer_insights), 1), true);
select setval(pg_get_serial_sequence('support_tickets', 'id'), greatest((select coalesce(max(id), 1) from support_tickets), 1), true);
