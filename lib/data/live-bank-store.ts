import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { ApiError } from "@/lib/services/api";
import type {
  AccountRecord,
  AuthSessionRecord,
  AdminMetricRecord,
  BillRecord,
  CardRecord,
  ComplianceRecord,
  DocumentRecord,
  InsightRecord,
  LoanRecord,
  NotificationRecord,
  OpenConnectionRecord,
  PaymentRecord,
  SupportTicketRecord,
  TransactionRecord,
  TransferRecord,
  UserProfile,
  LocationRecord,
  WebhookEventRecord
} from "@/lib/data/mock-bank-store";

type AccountRow = {
  id: number;
  user_id: string | null;
  name: string;
  type: string;
  balance: number | string;
  currency: string;
  tenant_id: string;
  created_at: string;
};

type TransactionRow = {
  id: number;
  account_id: number | null;
  amount: number | string;
  description: string | null;
  date: string;
  category: string | null;
  status: string;
  tenant_id: string;
};

type TransferRow = {
  id: number;
  from_id: number | null;
  to_id: number | null;
  amount: number | string;
  method: string;
  status: string;
  tenant_id: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  tenant_id: string;
  created_at: string;
};

type BillRow = {
  id: number;
  payee_id: number | null;
  payee_name: string;
  amount: number | string;
  schedule: unknown;
  status: string;
  tenant_id: string;
  created_at: string;
};

type PaymentRow = {
  id: number;
  recipient: string;
  amount: number | string;
  channel: string;
  status: string;
  tenant_id: string;
  created_at: string;
};

type CardRow = {
  id: number;
  user_id: string | null;
  last4: string;
  status: string;
  alerts_enabled: boolean;
  tenant_id: string;
  created_at: string;
};

type LoanRow = {
  id: number;
  user_id: string | null;
  type: string;
  balance: number | string;
  next_payment: number | string;
  tenant_id: string;
  created_at: string;
};

type NotificationRow = {
  id: number;
  user_id: string | null;
  message: string;
  channel: string;
  status: string;
  tenant_id: string;
  created_at: string;
};

type DocumentRow = {
  id: number;
  user_id: string | null;
  url: string;
  type: string;
  status: string;
  tenant_id: string;
  created_at: string;
};

type InsightRow = {
  id: number;
  user_id: string | null;
  title: string;
  score: number;
  summary: string;
  tenant_id: string;
  created_at: string;
};

type ComplianceRow = {
  id: number;
  user_id: string | null;
  reg: string;
  status: string;
  note: string;
  tenant_id: string;
  created_at: string;
};

type AdminMetricRow = {
  id: number;
  category: string;
  label: string;
  value: number | string;
  tenant_id: string;
  created_at: string;
};

type SupportTicketRow = {
  id: number;
  user_id: string | null;
  subject: string;
  message: string;
  status: string;
  tenant_id: string;
  created_at: string;
};

type LocationRow = {
  id: number;
  name: string;
  address: string;
  lat: number | string;
  lng: number | string;
  kind: string;
  tenant_id: string;
  created_at: string;
};

type OpenConnectionRow = {
  id: number;
  provider: string;
  status: string;
  last_synced_at: string;
  tenant_id: string;
  created_at: string;
};

type WebhookRow = {
  id: number;
  event_type: string;
  payload: Record<string, unknown>;
  status: string;
  tenant_id: string;
  created_at: string;
};

type SessionRow = {
  id: string;
  user_id: string | null;
  tenant_id: string;
  status: string;
  created_at: string;
};

type InsightsSummary = {
  healthScore: number;
  savingsRate: number;
  totalBalance: number;
  monthlySpend: number;
  insights: InsightRecord[];
};

function toNumber(value: number | string | null | undefined, field: string) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  throw new ApiError(500, `Invalid numeric value for ${field}`);
}

function ensureData<T>(data: T | null, errorMessage: string) {
  if (!data) {
    throw new ApiError(404, errorMessage);
  }

  return data;
}

function parseSchedule(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "label" in value) {
    const label = (value as { label?: unknown }).label;
    if (typeof label === "string") {
      return label;
    }
  }

  return "monthly";
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name ?? "Member",
    role: row.role === "admin" ? "admin" : "member",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapAccount(row: AccountRow): AccountRecord {
  return {
    id: row.id,
    userId: row.user_id ?? "",
    name: row.name,
    type: row.type,
    balance: toNumber(row.balance, "accounts.balance"),
    currency: row.currency === "USD" ? "USD" : "USD",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapTransaction(row: TransactionRow): TransactionRecord {
  return {
    id: row.id,
    accountId: row.account_id ?? 0,
    amount: toNumber(row.amount, "transactions.amount"),
    description: row.description ?? "",
    date: row.date,
    category: row.category ?? "General",
    status: row.status === "pending" ? "pending" : "posted",
    tenantId: row.tenant_id
  };
}

function mapTransfer(row: TransferRow): TransferRecord {
  return {
    id: row.id,
    fromId: row.from_id ?? 0,
    toId: row.to_id ?? 0,
    amount: toNumber(row.amount, "transfers.amount"),
    method: row.method === "external" || row.method === "ach" ? row.method : "internal",
    status: row.status === "queued" || row.status === "cancelled" ? row.status : "completed",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapBill(row: BillRow): BillRecord {
  return {
    id: row.id,
    payeeId: row.payee_id ?? 0,
    payeeName: row.payee_name,
    amount: toNumber(row.amount, "bills.amount"),
    schedule: parseSchedule(row.schedule),
    status: row.status === "paid" || row.status === "paused" ? row.status : "scheduled",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapPayment(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    recipient: row.recipient,
    amount: toNumber(row.amount, "payments.amount"),
    channel: row.channel === "wire" ? "wire" : "p2p",
    status: row.status === "completed" || row.status === "cancelled" ? row.status : "processing",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapCard(row: CardRow): CardRecord {
  return {
    id: row.id,
    userId: row.user_id ?? "",
    last4: row.last4,
    status: row.status === "active" || row.status === "locked" ? row.status : "inactive",
    alertsEnabled: row.alerts_enabled,
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapLoan(row: LoanRow): LoanRecord {
  return {
    id: row.id,
    userId: row.user_id ?? "",
    type: row.type,
    balance: toNumber(row.balance, "loans.balance"),
    nextPayment: toNumber(row.next_payment, "loans.next_payment"),
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapNotification(row: NotificationRow): NotificationRecord {
  return {
    id: row.id,
    userId: row.user_id ?? "",
    message: row.message,
    channel: row.channel === "email" || row.channel === "sms" ? row.channel : "push",
    status: row.status === "disabled" ? "disabled" : "active",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapDocument(row: DocumentRow): DocumentRecord {
  return {
    id: row.id,
    userId: row.user_id ?? "",
    url: row.url,
    type: row.type,
    status: row.status === "ready" ? "ready" : "processing",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapInsight(row: InsightRow): InsightRecord {
  return {
    id: row.id,
    userId: row.user_id ?? "",
    title: row.title,
    score: row.score,
    summary: row.summary,
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapCompliance(row: ComplianceRow): ComplianceRecord {
  return {
    id: row.id,
    userId: row.user_id ?? "",
    reg: row.reg,
    status: row.status === "review" || row.status === "blocked" ? row.status : "clear",
    note: row.note,
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapAdminMetric(row: AdminMetricRow): AdminMetricRecord {
  return {
    id: row.id,
    category: row.category,
    label: row.label,
    value: toNumber(row.value, "admin_metrics.value"),
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapSupportTicket(row: SupportTicketRow): SupportTicketRecord {
  return {
    id: row.id,
    userId: row.user_id ?? "",
    subject: row.subject,
    message: row.message,
    status: row.status === "pending" || row.status === "closed" ? row.status : "open",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapLocation(row: LocationRow): LocationRecord {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    lat: toNumber(row.lat, "locations.lat"),
    lng: toNumber(row.lng, "locations.lng"),
    kind: row.kind === "atm" ? "atm" : "branch",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapOpenConnection(row: OpenConnectionRow): OpenConnectionRecord {
  return {
    id: row.id,
    provider: row.provider,
    status: row.status === "syncing" || row.status === "disconnected" ? row.status : "connected",
    lastSyncedAt: row.last_synced_at,
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

function mapWebhook(row: WebhookRow): WebhookEventRecord {
  return {
    id: row.id,
    eventType: row.event_type,
    payload: row.payload,
    status: row.status === "processed" ? "processed" : "received",
    tenantId: row.tenant_id,
    createdAt: row.created_at
  };
}

async function fetchProfilesByTenant(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("profiles")
    .select("id,email,full_name,role,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as ProfileRow[]).map(mapProfile);
}

export async function listUsers(tenantId: string) {
  return fetchProfilesByTenant(tenantId);
}

export async function getUserById(tenantId: string, id: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("profiles")
    .select("id,email,full_name,role,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapProfile(ensureData(result.data as ProfileRow | null, "users record not found"));
}

export async function createUser(
  tenantId: string,
  payload: Pick<UserProfile, "email" | "fullName"> & { role?: UserProfile["role"]; id?: string }
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("profiles")
    .insert({
      id: payload.id ?? crypto.randomUUID(),
      email: payload.email,
      full_name: payload.fullName,
      role: payload.role ?? "member",
      tenant_id: tenantId
    })
    .select("id,email,full_name,role,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapProfile(result.data as ProfileRow);
}

export async function updateUser(
  tenantId: string,
  id: string,
  payload: Partial<Pick<UserProfile, "email" | "fullName" | "role">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("profiles")
    .update({
      email: payload.email,
      full_name: payload.fullName,
      role: payload.role
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,email,full_name,role,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapProfile(ensureData(result.data as ProfileRow | null, "users record not found"));
}

export async function deleteUser(tenantId: string, id: string) {
  const supabase = getSupabaseAdminClient();
  const existing = await getUserById(tenantId, id);
  const result = await supabase.from("profiles").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function findPrimaryUserId(tenantId: string) {
  const users = await listUsers(tenantId);
  return users[0]?.id ?? createUser(tenantId, {
    email: `member+${tenantId}@bank.test`,
    fullName: "Primary Member"
  }).then((user) => user.id);
}

export async function listAccounts(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("accounts")
    .select("id,user_id,name,type,balance,currency,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as AccountRow[]).map(mapAccount);
}

export async function getAccountById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("accounts")
    .select("id,user_id,name,type,balance,currency,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapAccount(ensureData(result.data as AccountRow | null, "accounts record not found"));
}

export async function createAccount(
  tenantId: string,
  payload: Pick<AccountRecord, "userId" | "name" | "type" | "balance" | "currency">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("accounts")
    .insert({
      user_id: payload.userId,
      name: payload.name,
      type: payload.type,
      balance: payload.balance,
      currency: payload.currency,
      tenant_id: tenantId
    })
    .select("id,user_id,name,type,balance,currency,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapAccount(result.data as AccountRow);
}

export async function updateAccount(
  tenantId: string,
  id: number,
  payload: Partial<Pick<AccountRecord, "userId" | "name" | "type" | "balance" | "currency">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("accounts")
    .update({
      user_id: payload.userId,
      name: payload.name,
      type: payload.type,
      balance: payload.balance,
      currency: payload.currency
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,user_id,name,type,balance,currency,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapAccount(ensureData(result.data as AccountRow | null, "accounts record not found"));
}

export async function deleteAccount(tenantId: string, id: number) {
  const existing = await getAccountById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("accounts").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function listTransactions(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("transactions")
    .select("id,account_id,amount,description,date,category,status,tenant_id")
    .eq("tenant_id", tenantId)
    .order("date", { ascending: false });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as TransactionRow[]).map(mapTransaction);
}

export async function getTransactionById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("transactions")
    .select("id,account_id,amount,description,date,category,status,tenant_id")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapTransaction(ensureData(result.data as TransactionRow | null, "transactions record not found"));
}

export async function createTransaction(
  tenantId: string,
  payload: Pick<TransactionRecord, "accountId" | "amount" | "description" | "date" | "category" | "status">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("transactions")
    .insert({
      account_id: payload.accountId,
      amount: payload.amount,
      description: payload.description,
      date: payload.date,
      category: payload.category,
      status: payload.status,
      tenant_id: tenantId
    })
    .select("id,account_id,amount,description,date,category,status,tenant_id")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapTransaction(result.data as TransactionRow);
}

export async function updateTransaction(
  tenantId: string,
  id: number,
  payload: Partial<Pick<TransactionRecord, "accountId" | "amount" | "description" | "date" | "category" | "status">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("transactions")
    .update({
      account_id: payload.accountId,
      amount: payload.amount,
      description: payload.description,
      date: payload.date,
      category: payload.category,
      status: payload.status
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,account_id,amount,description,date,category,status,tenant_id")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapTransaction(ensureData(result.data as TransactionRow | null, "transactions record not found"));
}

export async function deleteTransaction(tenantId: string, id: number) {
  const existing = await getTransactionById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("transactions").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function listTransfers(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("transfers")
    .select("id,from_id,to_id,amount,method,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as TransferRow[]).map(mapTransfer);
}

export async function getTransferById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("transfers")
    .select("id,from_id,to_id,amount,method,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapTransfer(ensureData(result.data as TransferRow | null, "transfers record not found"));
}

export async function createTransfer(
  tenantId: string,
  payload: Pick<TransferRecord, "fromId" | "toId" | "amount" | "method" | "status" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("transfers")
    .insert({
      from_id: payload.fromId,
      to_id: payload.toId,
      amount: payload.amount,
      method: payload.method,
      status: payload.status,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,from_id,to_id,amount,method,status,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapTransfer(result.data as TransferRow);
}

export async function updateTransfer(
  tenantId: string,
  id: number,
  payload: Partial<Pick<TransferRecord, "fromId" | "toId" | "amount" | "method" | "status">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("transfers")
    .update({
      from_id: payload.fromId,
      to_id: payload.toId,
      amount: payload.amount,
      method: payload.method,
      status: payload.status
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,from_id,to_id,amount,method,status,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapTransfer(ensureData(result.data as TransferRow | null, "transfers record not found"));
}

export async function deleteTransfer(tenantId: string, id: number) {
  const existing = await getTransferById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("transfers").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function runTransfer(tenantId: string, payload: Pick<TransferRecord, "fromId" | "toId" | "amount" | "method">) {
  const fromAccount = await getAccountById(tenantId, payload.fromId);
  const toAccount = await getAccountById(tenantId, payload.toId);

  if (fromAccount.balance < payload.amount) {
    throw new ApiError(400, "Insufficient funds");
  }

  await updateAccount(tenantId, fromAccount.id, {
    balance: Number((fromAccount.balance - payload.amount).toFixed(2))
  });
  await updateAccount(tenantId, toAccount.id, {
    balance: Number((toAccount.balance + payload.amount).toFixed(2))
  });

  const createdAt = new Date().toISOString();
  const transfer = await createTransfer(tenantId, {
    ...payload,
    status: "completed",
    createdAt
  });

  await createTransaction(tenantId, {
    accountId: fromAccount.id,
    amount: -payload.amount,
    description: `Transfer to ${toAccount.name}`,
    date: createdAt,
    category: "Transfer",
    status: "posted"
  });

  await createTransaction(tenantId, {
    accountId: toAccount.id,
    amount: payload.amount,
    description: `Transfer from ${fromAccount.name}`,
    date: createdAt,
    category: "Transfer",
    status: "posted"
  });

  return transfer;
}

export async function listBills(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("bills")
    .select("id,payee_id,payee_name,amount,schedule,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as BillRow[]).map(mapBill);
}

export async function listPayments(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("payments")
    .select("id,recipient,amount,channel,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as PaymentRow[]).map(mapPayment);
}

export async function getPaymentById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("payments")
    .select("id,recipient,amount,channel,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapPayment(ensureData(result.data as PaymentRow | null, "payments record not found"));
}

export async function createPayment(
  tenantId: string,
  payload: Pick<PaymentRecord, "recipient" | "amount" | "channel" | "status" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("payments")
    .insert({
      recipient: payload.recipient,
      amount: payload.amount,
      channel: payload.channel,
      status: payload.status,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,recipient,amount,channel,status,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapPayment(result.data as PaymentRow);
}

export async function updatePayment(
  tenantId: string,
  id: number,
  payload: Partial<Pick<PaymentRecord, "recipient" | "amount" | "channel" | "status">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("payments")
    .update({
      recipient: payload.recipient,
      amount: payload.amount,
      channel: payload.channel,
      status: payload.status
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,recipient,amount,channel,status,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapPayment(ensureData(result.data as PaymentRow | null, "payments record not found"));
}

export async function deletePayment(tenantId: string, id: number) {
  const existing = await getPaymentById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("payments").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function getBillById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("bills")
    .select("id,payee_id,payee_name,amount,schedule,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapBill(ensureData(result.data as BillRow | null, "bills record not found"));
}

export async function createBill(
  tenantId: string,
  payload: Pick<BillRecord, "payeeId" | "payeeName" | "amount" | "schedule" | "status" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("bills")
    .insert({
      payee_id: payload.payeeId,
      payee_name: payload.payeeName,
      amount: payload.amount,
      schedule: { label: payload.schedule },
      status: payload.status,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,payee_id,payee_name,amount,schedule,status,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapBill(result.data as BillRow);
}

export async function updateBill(
  tenantId: string,
  id: number,
  payload: Partial<Pick<BillRecord, "payeeId" | "payeeName" | "amount" | "schedule" | "status">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("bills")
    .update({
      payee_id: payload.payeeId,
      payee_name: payload.payeeName,
      amount: payload.amount,
      schedule: payload.schedule ? { label: payload.schedule } : undefined,
      status: payload.status
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,payee_id,payee_name,amount,schedule,status,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapBill(ensureData(result.data as BillRow | null, "bills record not found"));
}

export async function deleteBill(tenantId: string, id: number) {
  const existing = await getBillById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("bills").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function listCards(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("cards")
    .select("id,user_id,last4,status,alerts_enabled,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as CardRow[]).map(mapCard);
}

export async function listLoans(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("loans")
    .select("id,user_id,type,balance,next_payment,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as LoanRow[]).map(mapLoan);
}

export async function getLoanById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("loans")
    .select("id,user_id,type,balance,next_payment,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapLoan(ensureData(result.data as LoanRow | null, "loans record not found"));
}

export async function createLoan(
  tenantId: string,
  payload: Pick<LoanRecord, "userId" | "type" | "balance" | "nextPayment" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("loans")
    .insert({
      user_id: payload.userId,
      type: payload.type,
      balance: payload.balance,
      next_payment: payload.nextPayment,
      payments: [],
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,user_id,type,balance,next_payment,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapLoan(result.data as LoanRow);
}

export async function updateLoan(
  tenantId: string,
  id: number,
  payload: Partial<Pick<LoanRecord, "userId" | "type" | "balance" | "nextPayment">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("loans")
    .update({
      user_id: payload.userId,
      type: payload.type,
      balance: payload.balance,
      next_payment: payload.nextPayment
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,user_id,type,balance,next_payment,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapLoan(ensureData(result.data as LoanRow | null, "loans record not found"));
}

export async function deleteLoan(tenantId: string, id: number) {
  const existing = await getLoanById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("loans").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function payLoan(tenantId: string, id: number, amount: number) {
  const loan = await getLoanById(tenantId, id);
  return updateLoan(tenantId, id, {
    balance: Math.max(0, Number((loan.balance - amount).toFixed(2)))
  });
}

export async function getCardById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("cards")
    .select("id,user_id,last4,status,alerts_enabled,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapCard(ensureData(result.data as CardRow | null, "cards record not found"));
}

export async function createCard(
  tenantId: string,
  payload: Pick<CardRecord, "userId" | "last4" | "status" | "alertsEnabled" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("cards")
    .insert({
      user_id: payload.userId,
      number: `****${payload.last4}`,
      last4: payload.last4,
      limits: {},
      status: payload.status,
      alerts_enabled: payload.alertsEnabled,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,user_id,last4,status,alerts_enabled,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapCard(result.data as CardRow);
}

export async function updateCard(
  tenantId: string,
  id: number,
  payload: Partial<Pick<CardRecord, "userId" | "last4" | "status" | "alertsEnabled">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("cards")
    .update({
      user_id: payload.userId,
      number: payload.last4 ? `****${payload.last4}` : undefined,
      last4: payload.last4,
      status: payload.status,
      alerts_enabled: payload.alertsEnabled
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,user_id,last4,status,alerts_enabled,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapCard(ensureData(result.data as CardRow | null, "cards record not found"));
}

export async function deleteCard(tenantId: string, id: number) {
  const existing = await getCardById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("cards").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function listNotifications(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("notifications")
    .select("id,user_id,message,channel,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as NotificationRow[]).map(mapNotification);
}

export async function getNotificationById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("notifications")
    .select("id,user_id,message,channel,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapNotification(ensureData(result.data as NotificationRow | null, "notifications record not found"));
}

export async function createNotification(
  tenantId: string,
  payload: Pick<NotificationRecord, "userId" | "message" | "channel" | "status" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("notifications")
    .insert({
      user_id: payload.userId,
      message: payload.message,
      channel: payload.channel,
      status: payload.status,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,user_id,message,channel,status,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapNotification(result.data as NotificationRow);
}

export async function updateNotification(
  tenantId: string,
  id: number,
  payload: Partial<Pick<NotificationRecord, "userId" | "message" | "channel" | "status">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("notifications")
    .update({
      user_id: payload.userId,
      message: payload.message,
      channel: payload.channel,
      status: payload.status
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,user_id,message,channel,status,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapNotification(ensureData(result.data as NotificationRow | null, "notifications record not found"));
}

export async function deleteNotification(tenantId: string, id: number) {
  const existing = await getNotificationById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("notifications").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function listDocuments(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("documents")
    .select("id,user_id,url,type,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as DocumentRow[]).map(mapDocument);
}

export async function getDocumentById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("documents")
    .select("id,user_id,url,type,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapDocument(ensureData(result.data as DocumentRow | null, "documents record not found"));
}

export async function createDocument(
  tenantId: string,
  payload: Pick<DocumentRecord, "userId" | "url" | "type" | "status" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("documents")
    .insert({
      user_id: payload.userId,
      url: payload.url,
      type: payload.type,
      status: payload.status,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,user_id,url,type,status,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapDocument(result.data as DocumentRow);
}

export async function updateDocument(
  tenantId: string,
  id: number,
  payload: Partial<Pick<DocumentRecord, "userId" | "url" | "type" | "status">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("documents")
    .update({
      user_id: payload.userId,
      url: payload.url,
      type: payload.type,
      status: payload.status
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,user_id,url,type,status,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapDocument(ensureData(result.data as DocumentRow | null, "documents record not found"));
}

export async function deleteDocument(tenantId: string, id: number) {
  const existing = await getDocumentById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("documents").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function listInsights(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("customer_insights")
    .select("id,user_id,title,score,summary,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as InsightRow[]).map(mapInsight);
}

export async function listComplianceRecords(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("compliance_records")
    .select("id,user_id,reg,status,note,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as ComplianceRow[]).map(mapCompliance);
}

export async function getComplianceRecordById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("compliance_records")
    .select("id,user_id,reg,status,note,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapCompliance(ensureData(result.data as ComplianceRow | null, "compliance record not found"));
}

export async function createComplianceRecord(
  tenantId: string,
  payload: Pick<ComplianceRecord, "userId" | "reg" | "status" | "note" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("compliance_records")
    .insert({
      user_id: payload.userId,
      reg: payload.reg,
      status: payload.status,
      note: payload.note,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,user_id,reg,status,note,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapCompliance(result.data as ComplianceRow);
}

export async function updateComplianceRecord(
  tenantId: string,
  id: number,
  payload: Partial<Pick<ComplianceRecord, "userId" | "reg" | "status" | "note">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("compliance_records")
    .update({
      user_id: payload.userId,
      reg: payload.reg,
      status: payload.status,
      note: payload.note
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,user_id,reg,status,note,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapCompliance(ensureData(result.data as ComplianceRow | null, "compliance record not found"));
}

export async function deleteComplianceRecord(tenantId: string, id: number) {
  const existing = await getComplianceRecordById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("compliance_records").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function listAdminMetrics(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("admin_metrics")
    .select("id,category,label,value,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as AdminMetricRow[]).map(mapAdminMetric);
}

export async function getAdminMetricById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("admin_metrics")
    .select("id,category,label,value,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapAdminMetric(ensureData(result.data as AdminMetricRow | null, "adminMetrics record not found"));
}

export async function createAdminMetric(
  tenantId: string,
  payload: Pick<AdminMetricRecord, "category" | "label" | "value" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("admin_metrics")
    .insert({
      category: payload.category,
      label: payload.label,
      value: payload.value,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,category,label,value,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapAdminMetric(result.data as AdminMetricRow);
}

export async function updateAdminMetric(
  tenantId: string,
  id: number,
  payload: Partial<Pick<AdminMetricRecord, "category" | "label" | "value">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("admin_metrics")
    .update({
      category: payload.category,
      label: payload.label,
      value: payload.value
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,category,label,value,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapAdminMetric(ensureData(result.data as AdminMetricRow | null, "adminMetrics record not found"));
}

export async function deleteAdminMetric(tenantId: string, id: number) {
  const existing = await getAdminMetricById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("admin_metrics").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function getInsightById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("customer_insights")
    .select("id,user_id,title,score,summary,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapInsight(ensureData(result.data as InsightRow | null, "insights record not found"));
}

export async function createInsight(
  tenantId: string,
  payload: Pick<InsightRecord, "userId" | "title" | "score" | "summary" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("customer_insights")
    .insert({
      user_id: payload.userId,
      title: payload.title,
      score: payload.score,
      summary: payload.summary,
      insights: { title: payload.title, summary: payload.summary, score: payload.score },
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,user_id,title,score,summary,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapInsight(result.data as InsightRow);
}

export async function updateInsight(
  tenantId: string,
  id: number,
  payload: Partial<Pick<InsightRecord, "userId" | "title" | "score" | "summary">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("customer_insights")
    .update({
      user_id: payload.userId,
      title: payload.title,
      score: payload.score,
      summary: payload.summary,
      insights:
        payload.title || payload.summary || payload.score !== undefined
          ? {
              title: payload.title,
              summary: payload.summary,
              score: payload.score
            }
          : undefined
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,user_id,title,score,summary,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapInsight(ensureData(result.data as InsightRow | null, "insights record not found"));
}

export async function deleteInsight(tenantId: string, id: number) {
  const existing = await getInsightById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("customer_insights").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function summarizeInsights(tenantId: string): Promise<InsightsSummary> {
  const [accounts, transactions, insights] = await Promise.all([
    listAccounts(tenantId),
    listTransactions(tenantId),
    listInsights(tenantId)
  ]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlySpend = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  const monthlyIncome = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.min(1, (monthlyIncome - monthlySpend) / monthlyIncome)) : 0;
  const averageScore = insights.length > 0 ? insights.reduce((sum, insight) => sum + insight.score, 0) / insights.length : 80;

  return {
    healthScore: Math.round(averageScore),
    savingsRate,
    totalBalance,
    monthlySpend,
    insights
  };
}

export async function listSupportTickets(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("support_tickets")
    .select("id,user_id,subject,message,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as SupportTicketRow[]).map(mapSupportTicket);
}

export async function listLocations(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("locations")
    .select("id,name,address,lat,lng,kind,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as LocationRow[]).map(mapLocation);
}

export async function getLocationById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("locations")
    .select("id,name,address,lat,lng,kind,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapLocation(ensureData(result.data as LocationRow | null, "locations record not found"));
}

export async function createLocation(
  tenantId: string,
  payload: Pick<LocationRecord, "name" | "address" | "lat" | "lng" | "kind" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("locations")
    .insert({
      name: payload.name,
      address: payload.address,
      lat: payload.lat,
      lng: payload.lng,
      kind: payload.kind,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,name,address,lat,lng,kind,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapLocation(result.data as LocationRow);
}

export async function updateLocation(
  tenantId: string,
  id: number,
  payload: Partial<Pick<LocationRecord, "name" | "address" | "lat" | "lng" | "kind">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("locations")
    .update({
      name: payload.name,
      address: payload.address,
      lat: payload.lat,
      lng: payload.lng,
      kind: payload.kind
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,name,address,lat,lng,kind,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapLocation(ensureData(result.data as LocationRow | null, "locations record not found"));
}

export async function deleteLocation(tenantId: string, id: number) {
  const existing = await getLocationById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("locations").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function listOpenConnections(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("open_connections")
    .select("id,provider,status,last_synced_at,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("id", { ascending: true });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as OpenConnectionRow[]).map(mapOpenConnection);
}

export async function getOpenConnectionById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("open_connections")
    .select("id,provider,status,last_synced_at,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapOpenConnection(ensureData(result.data as OpenConnectionRow | null, "openConnections record not found"));
}

export async function createOpenConnection(
  tenantId: string,
  payload: Pick<OpenConnectionRecord, "provider" | "status" | "lastSyncedAt" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("open_connections")
    .insert({
      provider: payload.provider,
      status: payload.status,
      last_synced_at: payload.lastSyncedAt,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,provider,status,last_synced_at,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapOpenConnection(result.data as OpenConnectionRow);
}

export async function updateOpenConnection(
  tenantId: string,
  id: number,
  payload: Partial<Pick<OpenConnectionRecord, "provider" | "status" | "lastSyncedAt">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("open_connections")
    .update({
      provider: payload.provider,
      status: payload.status,
      last_synced_at: payload.lastSyncedAt
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,provider,status,last_synced_at,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapOpenConnection(ensureData(result.data as OpenConnectionRow | null, "openConnections record not found"));
}

export async function deleteOpenConnection(tenantId: string, id: number) {
  const existing = await getOpenConnectionById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("open_connections").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function listWebhookEvents(tenantId: string) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("webhooks")
    .select("id,event_type,payload,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return ((result.data ?? []) as WebhookRow[]).map(mapWebhook);
}

export async function getWebhookEventById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("webhooks")
    .select("id,event_type,payload,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapWebhook(ensureData(result.data as WebhookRow | null, "webhooks record not found"));
}

export async function createWebhookEvent(
  tenantId: string,
  payload: Pick<WebhookEventRecord, "eventType" | "payload" | "status" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("webhooks")
    .insert({
      event_type: payload.eventType,
      payload: payload.payload,
      status: payload.status,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,event_type,payload,status,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapWebhook(result.data as WebhookRow);
}

export async function updateWebhookEvent(
  tenantId: string,
  id: number,
  payload: Partial<Pick<WebhookEventRecord, "eventType" | "payload" | "status">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("webhooks")
    .update({
      event_type: payload.eventType,
      payload: payload.payload,
      status: payload.status
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,event_type,payload,status,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapWebhook(ensureData(result.data as WebhookRow | null, "webhooks record not found"));
}

export async function deleteWebhookEvent(tenantId: string, id: number) {
  const existing = await getWebhookEventById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("webhooks").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function getSupportTicketById(tenantId: string, id: number) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("support_tickets")
    .select("id,user_id,subject,message,status,tenant_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapSupportTicket(ensureData(result.data as SupportTicketRow | null, "supportTickets record not found"));
}

export async function createSupportTicket(
  tenantId: string,
  payload: Pick<SupportTicketRecord, "userId" | "subject" | "message" | "status" | "createdAt">
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("support_tickets")
    .insert({
      user_id: payload.userId,
      subject: payload.subject,
      message: payload.message,
      status: payload.status,
      tenant_id: tenantId,
      created_at: payload.createdAt
    })
    .select("id,user_id,subject,message,status,tenant_id,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapSupportTicket(result.data as SupportTicketRow);
}

export async function updateSupportTicket(
  tenantId: string,
  id: number,
  payload: Partial<Pick<SupportTicketRecord, "userId" | "subject" | "message" | "status">>
) {
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("support_tickets")
    .update({
      user_id: payload.userId,
      subject: payload.subject,
      message: payload.message,
      status: payload.status
    })
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .select("id,user_id,subject,message,status,tenant_id,created_at")
    .maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return mapSupportTicket(ensureData(result.data as SupportTicketRow | null, "supportTickets record not found"));
}

export async function deleteSupportTicket(tenantId: string, id: number) {
  const existing = await getSupportTicketById(tenantId, id);
  const supabase = getSupabaseAdminClient();
  const result = await supabase.from("support_tickets").delete().eq("tenant_id", tenantId).eq("id", id);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return existing;
}

export async function getAuthSession(tenantId: string, sessionId?: string): Promise<AuthSessionRecord> {
  const supabase = getSupabaseAdminClient();
  const query = supabase
    .from("sessions")
    .select("id,user_id,tenant_id,status,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1);

  const scopedQuery = sessionId ? query.eq("id", sessionId) : query;
  const result = await scopedQuery.maybeSingle();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  const session = ensureData(result.data as SessionRow | null, "authSessions record not found");
  const user = session.user_id ? await getUserById(tenantId, session.user_id) : null;

  return {
    id: session.id,
    userId: session.user_id ?? "",
    email: user?.email ?? "member@bank.test",
    status: session.status === "signed_out" ? "signed_out" : "active",
    tenantId: session.tenant_id,
    createdAt: session.created_at
  };
}

export async function createAuthSession(tenantId: string, email: string, userId?: string) {
  const resolvedUserId = userId ?? (await findPrimaryUserId(tenantId));
  const supabase = getSupabaseAdminClient();
  const result = await supabase
    .from("sessions")
    .insert({
      user_id: resolvedUserId,
      tenant_id: tenantId,
      status: "active"
    })
    .select("id,user_id,tenant_id,status,created_at")
    .single();

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  const session = result.data as SessionRow;
  return {
    id: session.id,
    userId: session.user_id ?? resolvedUserId,
    email,
    status: "active" as const,
    tenantId: session.tenant_id,
    createdAt: session.created_at
  };
}

export async function signOutSession(tenantId: string, sessionId: string) {
  const supabase = getSupabaseAdminClient();
  const current = await getAuthSession(tenantId, sessionId);
  const result = await supabase
    .from("sessions")
    .update({ status: "signed_out" })
    .eq("tenant_id", tenantId)
    .eq("id", sessionId);

  if (result.error) {
    throw new ApiError(500, result.error.message);
  }

  return {
    ...current,
    status: "signed_out" as const
  };
}
