alter table if exists audit_logs add column if not exists details jsonb not null default '{}'::jsonb;

create index if not exists idx_audit_logs_details on audit_logs using gin (details);
