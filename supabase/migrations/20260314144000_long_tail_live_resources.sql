create table if not exists payments (
  id bigserial primary key,
  recipient text not null,
  amount decimal not null,
  channel text not null,
  status text not null default 'processing',
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists admin_metrics (
  id bigserial primary key,
  category text not null,
  label text not null,
  value decimal not null,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists locations (
  id bigserial primary key,
  name text not null,
  address text not null,
  lat decimal not null,
  lng decimal not null,
  kind text not null,
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists open_connections (
  id bigserial primary key,
  provider text not null,
  status text not null default 'connected',
  last_synced_at timestamptz not null default now(),
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

create table if not exists webhooks (
  id bigserial primary key,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'received',
  tenant_id uuid not null references tenants(id),
  created_at timestamptz not null default now()
);

alter table loans
  add column if not exists type text not null default 'personal',
  add column if not exists next_payment decimal not null default 0,
  add column if not exists created_at timestamptz not null default now();

alter table compliance_records
  add column if not exists note text not null default '',
  add column if not exists created_at timestamptz not null default now();

create index if not exists idx_payments_tenant_created_at on payments (tenant_id, created_at desc);
create index if not exists idx_admin_metrics_tenant_category on admin_metrics (tenant_id, category);
create index if not exists idx_locations_tenant_kind on locations (tenant_id, kind);
create index if not exists idx_open_connections_tenant_status on open_connections (tenant_id, status);
create index if not exists idx_webhooks_tenant_status on webhooks (tenant_id, status);

alter table payments enable row level security;
alter table admin_metrics enable row level security;
alter table locations enable row level security;
alter table open_connections enable row level security;
alter table webhooks enable row level security;
alter table loans enable row level security;
alter table compliance_records enable row level security;

drop policy if exists "payments tenant access" on payments;
create policy "payments tenant access" on payments
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "admin metrics tenant access" on admin_metrics;
create policy "admin metrics tenant access" on admin_metrics
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "locations tenant access" on locations;
create policy "locations tenant access" on locations
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "open connections tenant access" on open_connections;
create policy "open connections tenant access" on open_connections
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "webhooks tenant access" on webhooks;
create policy "webhooks tenant access" on webhooks
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "loans tenant access" on loans;
create policy "loans tenant access" on loans
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

drop policy if exists "compliance records tenant access" on compliance_records;
create policy "compliance records tenant access" on compliance_records
  for all using (tenant_id = (select tenant_id from profiles where id = (select auth.uid())));

insert into payments (id, recipient, amount, channel, status, tenant_id, created_at)
values
  (101, 'Alpha', 25.00, 'p2p', 'processing', '11111111-1111-1111-1111-111111111111', now()),
  (201, 'Alpha', 25.00, 'p2p', 'processing', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into loans (id, user_id, type, balance, next_payment, payments, tenant_id, created_at)
values
  (101, '11111111-1111-1111-1111-111111111112', 'auto', 8300.22, 322.11, '[]'::jsonb, '11111111-1111-1111-1111-111111111111', now()),
  (201, '22222222-2222-2222-2222-222222222223', 'auto', 8300.22, 322.11, '[]'::jsonb, '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into compliance_records (id, reg, status, note, user_id, tenant_id, created_at)
values
  (101, 'OFAC', 'clear', 'No review required.', '11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', now()),
  (201, 'OFAC', 'clear', 'No review required.', '22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into admin_metrics (id, category, label, value, tenant_id, created_at)
values
  (101, 'engagement', 'MAU', 2400, '11111111-1111-1111-1111-111111111111', now()),
  (102, 'retention', 'Churn', 3, '11111111-1111-1111-1111-111111111111', now()),
  (201, 'engagement', 'MAU', 2400, '22222222-2222-2222-2222-222222222222', now()),
  (202, 'retention', 'Churn', 3, '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into locations (id, name, address, lat, lng, kind, tenant_id, created_at)
values
  (101, 'Downtown Branch', '100 Main St', 23.0225, 72.5714, 'branch', '11111111-1111-1111-1111-111111111111', now()),
  (201, 'Downtown Branch', '100 Main St', 23.0225, 72.5714, 'branch', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into open_connections (id, provider, status, last_synced_at, tenant_id, created_at)
values
  (101, 'Plaid mock', 'connected', now(), '11111111-1111-1111-1111-111111111111', now()),
  (201, 'Plaid mock', 'connected', now(), '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

insert into webhooks (id, event_type, payload, status, tenant_id, created_at)
values
  (101, 'account.updated', '{"source":"seed"}'::jsonb, 'received', '11111111-1111-1111-1111-111111111111', now()),
  (201, 'account.updated', '{"source":"seed"}'::jsonb, 'received', '22222222-2222-2222-2222-222222222222', now())
on conflict (id) do nothing;

select setval(pg_get_serial_sequence('payments', 'id'), greatest((select coalesce(max(id), 1) from payments), 1), true);
select setval(pg_get_serial_sequence('loans', 'id'), greatest((select coalesce(max(id), 1) from loans), 1), true);
select setval(pg_get_serial_sequence('compliance_records', 'id'), greatest((select coalesce(max(id), 1) from compliance_records), 1), true);
select setval(pg_get_serial_sequence('admin_metrics', 'id'), greatest((select coalesce(max(id), 1) from admin_metrics), 1), true);
select setval(pg_get_serial_sequence('locations', 'id'), greatest((select coalesce(max(id), 1) from locations), 1), true);
select setval(pg_get_serial_sequence('open_connections', 'id'), greatest((select coalesce(max(id), 1) from open_connections), 1), true);
select setval(pg_get_serial_sequence('webhooks', 'id'), greatest((select coalesce(max(id), 1) from webhooks), 1), true);
