import { demoTenants } from "@/lib/data/demo";
import { ApiError } from "@/lib/services/api";

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: "member" | "admin";
  tenantId: string;
  createdAt: string;
};

export type AccountRecord = {
  id: number;
  userId: string;
  name: string;
  type: string;
  balance: number;
  currency: "USD";
  tenantId: string;
  createdAt: string;
};

export type TransactionRecord = {
  id: number;
  accountId: number;
  amount: number;
  description: string;
  date: string;
  category: string;
  status: "posted" | "pending";
  tenantId: string;
};

export type TransferRecord = {
  id: number;
  fromId: number;
  toId: number;
  amount: number;
  method: "internal" | "external" | "ach";
  status: "queued" | "completed" | "cancelled";
  tenantId: string;
  createdAt: string;
};

export type PaymentRecord = {
  id: number;
  recipient: string;
  amount: number;
  channel: "p2p" | "wire";
  status: "processing" | "completed" | "cancelled";
  tenantId: string;
  createdAt: string;
};

export type BillRecord = {
  id: number;
  payeeId: number;
  payeeName: string;
  amount: number;
  schedule: string;
  status: "scheduled" | "paid" | "paused";
  tenantId: string;
  createdAt: string;
};

export type CardRecord = {
  id: number;
  userId: string;
  last4: string;
  status: "active" | "locked" | "inactive";
  alertsEnabled: boolean;
  tenantId: string;
  createdAt: string;
};

export type LoanRecord = {
  id: number;
  userId: string;
  type: string;
  balance: number;
  nextPayment: number;
  tenantId: string;
  createdAt: string;
};

export type DocumentRecord = {
  id: number;
  userId: string;
  url: string;
  type: string;
  status: "ready" | "processing";
  tenantId: string;
  createdAt: string;
};

export type NotificationRecord = {
  id: number;
  userId: string;
  message: string;
  channel: "email" | "sms" | "push";
  status: "active" | "disabled";
  tenantId: string;
  createdAt: string;
};

export type InsightRecord = {
  id: number;
  userId: string;
  title: string;
  score: number;
  summary: string;
  tenantId: string;
  createdAt: string;
};

export type ComplianceRecord = {
  id: number;
  userId: string;
  reg: string;
  status: "clear" | "review" | "blocked";
  note: string;
  tenantId: string;
  createdAt: string;
};

export type AdminMetricRecord = {
  id: number;
  category: string;
  label: string;
  value: number;
  tenantId: string;
  createdAt: string;
};

export type SupportTicketRecord = {
  id: number;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "pending" | "closed";
  tenantId: string;
  createdAt: string;
};

export type LocationRecord = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  kind: "atm" | "branch";
  tenantId: string;
  createdAt: string;
};

export type WebhookEventRecord = {
  id: number;
  eventType: string;
  payload: Record<string, unknown>;
  status: "received" | "processed";
  tenantId: string;
  createdAt: string;
};

export type OpenConnectionRecord = {
  id: number;
  provider: string;
  status: "connected" | "syncing" | "disconnected";
  lastSyncedAt: string;
  tenantId: string;
  createdAt: string;
};

export type AuthSessionRecord = {
  id: string;
  userId: string;
  email: string;
  status: "active" | "signed_out";
  tenantId: string;
  createdAt: string;
};

export type TenantStore = {
  authSessions: AuthSessionRecord[];
  users: UserProfile[];
  accounts: AccountRecord[];
  transactions: TransactionRecord[];
  transfers: TransferRecord[];
  payments: PaymentRecord[];
  bills: BillRecord[];
  cards: CardRecord[];
  loans: LoanRecord[];
  documents: DocumentRecord[];
  notifications: NotificationRecord[];
  insights: InsightRecord[];
  compliance: ComplianceRecord[];
  adminMetrics: AdminMetricRecord[];
  supportTickets: SupportTicketRecord[];
  locations: LocationRecord[];
  webhooks: WebhookEventRecord[];
  openConnections: OpenConnectionRecord[];
  counters: Record<string, number>;
};

type ResourceKey = Exclude<keyof TenantStore, "counters">;

const STORE_KEY = "__bankAiMockStore";

function now() {
  return "2026-03-14T00:00:00.000Z";
}

function createTenantStore(tenantId: string, tenantName: string): TenantStore {
  const primaryUserId = `${tenantId}-user`;

  return {
    authSessions: [
      {
        id: `${tenantId}-session`,
        userId: primaryUserId,
        email: `member@${tenantName.toLowerCase().replace(/\s+/g, "")}.test`,
        status: "active",
        tenantId,
        createdAt: now()
      }
    ],
    users: [
      {
        id: primaryUserId,
        email: `member@${tenantName.toLowerCase().replace(/\s+/g, "")}.test`,
        fullName: `${tenantName} Member`,
        role: "member",
        tenantId,
        createdAt: now()
      }
    ],
    accounts: [
      {
        id: 1,
        userId: primaryUserId,
        name: "Everyday Checking",
        type: "checking",
        balance: 3520.11,
        currency: "USD",
        tenantId,
        createdAt: now()
      },
      {
        id: 2,
        userId: primaryUserId,
        name: "Rainy Day Savings",
        type: "savings",
        balance: 14220.54,
        currency: "USD",
        tenantId,
        createdAt: now()
      }
    ],
    transactions: [
      { id: 1, accountId: 1, amount: -5.5, description: "Coffee Roasters", date: "2026-03-12", category: "Food", status: "posted", tenantId },
      { id: 2, accountId: 1, amount: 2500, description: "Payroll Deposit", date: "2026-03-11", category: "Income", status: "posted", tenantId },
      { id: 3, accountId: 1, amount: -124.19, description: "Utility Bill", date: "2026-03-10", category: "Utilities", status: "posted", tenantId },
      { id: 4, accountId: 1, amount: -200, description: "Card Payment", date: "2026-03-09", category: "Credit", status: "pending", tenantId },
      { id: 5, accountId: 1, amount: -86.44, description: "Grocery Market", date: "2026-03-08", category: "Food", status: "posted", tenantId }
    ],
    transfers: [],
    payments: [],
    bills: [{ id: 1, payeeId: 1, payeeName: "Electric Co", amount: 124.19, schedule: "monthly", status: "scheduled", tenantId, createdAt: now() }],
    cards: [{ id: 1, userId: primaryUserId, last4: "4242", status: "active", alertsEnabled: true, tenantId, createdAt: now() }],
    loans: [{ id: 1, userId: primaryUserId, type: "auto", balance: 8300.22, nextPayment: 322.11, tenantId, createdAt: now() }],
    documents: [{ id: 1, userId: primaryUserId, url: "/docs/statement.pdf", type: "statement", status: "ready", tenantId, createdAt: now() }],
    notifications: [{ id: 1, userId: primaryUserId, message: "Large transaction alert", channel: "push", status: "active", tenantId, createdAt: now() }],
    insights: [{ id: 1, userId: primaryUserId, title: "Savings health", score: 86, summary: "You are on track this month.", tenantId, createdAt: now() }],
    compliance: [{ id: 1, userId: primaryUserId, reg: "OFAC", status: "clear", note: "No review required.", tenantId, createdAt: now() }],
    adminMetrics: [
      { id: 1, category: "engagement", label: "MAU", value: 2400, tenantId, createdAt: now() },
      { id: 2, category: "retention", label: "Churn", value: 3, tenantId, createdAt: now() }
    ],
    supportTickets: [{ id: 1, userId: primaryUserId, subject: "Card dispute", message: "Please review my dispute.", status: "open", tenantId, createdAt: now() }],
    locations: [{ id: 1, name: "Downtown Branch", address: "100 Main St", lat: 23.0225, lng: 72.5714, kind: "branch", tenantId, createdAt: now() }],
    webhooks: [],
    openConnections: [{ id: 1, provider: "Plaid mock", status: "connected", lastSyncedAt: now(), tenantId, createdAt: now() }],
    counters: {
      accounts: 2,
      transactions: 5,
      transfers: 0,
      payments: 0,
      bills: 1,
      cards: 1,
      loans: 1,
      documents: 1,
      notifications: 1,
      insights: 1,
      compliance: 1,
      adminMetrics: 2,
      supportTickets: 1,
      locations: 1,
      webhooks: 0,
      openConnections: 1
    }
  };
}

function createInitialStore() {
  return Object.fromEntries(
    demoTenants.map((tenant) => [tenant.id, createTenantStore(tenant.id, tenant.name)])
  ) as Record<string, TenantStore>;
}

function getStoreRoot() {
  const globalStore = globalThis as typeof globalThis & {
    [STORE_KEY]?: Record<string, TenantStore>;
  };

  if (!globalStore[STORE_KEY]) {
    globalStore[STORE_KEY] = createInitialStore();
  }

  return globalStore[STORE_KEY];
}

export function resetMockBankStore() {
  const globalStore = globalThis as typeof globalThis & {
    [STORE_KEY]?: Record<string, TenantStore>;
  };

  globalStore[STORE_KEY] = createInitialStore();
}

export function getTenantStore(tenantId: string) {
  const store = getStoreRoot()[tenantId];

  if (!store) {
    throw new ApiError(404, "Tenant store not found");
  }

  return store;
}

export function listRecords<K extends ResourceKey>(tenantId: string, resource: K) {
  const records = getTenantStore(tenantId)[resource];
  return structuredClone(records) as TenantStore[K];
}

export function getRecordById<K extends ResourceKey>(
  tenantId: string,
  resource: K,
  id: number | string
) {
  const records = getTenantStore(tenantId)[resource] as Array<{ id: number | string; tenantId: string }>;
  const record = records.find((entry) => entry.id === id && entry.tenantId === tenantId);

  if (!record) {
    throw new ApiError(404, `${String(resource)} record not found`);
  }

  return structuredClone(record) as TenantStore[K][number];
}

export function createRecord<
  K extends ResourceKey,
  T extends Omit<TenantStore[K][number], "id" | "tenantId"> & Partial<Pick<TenantStore[K][number], "id">>
>(
  tenantId: string,
  resource: K,
  payload: T
) {
  const store = getTenantStore(tenantId);
  const providedId = payload.id;
  const nextId =
    providedId ??
    (resource === "authSessions"
      ? `${tenantId}-session-${store.authSessions.length + 1}`
      : (store.counters[resource] ?? 0) + 1);

  if (typeof nextId === "number") {
    store.counters[resource] = Number(nextId);
  }

  const record = {
    ...payload,
    id: nextId,
    tenantId
  } as unknown as TenantStore[K][number];

  (store[resource] as Array<TenantStore[K][number]>).push(record);
  return structuredClone(record) as TenantStore[K][number];
}

export function updateRecord<K extends ResourceKey>(
  tenantId: string,
  resource: K,
  id: number | string,
  patch: Partial<Omit<TenantStore[K][number], "id" | "tenantId">>
) {
  const records = getTenantStore(tenantId)[resource] as Array<{ id: number | string; tenantId: string }>;
  const index = records.findIndex((entry) => entry.id === id && entry.tenantId === tenantId);

  if (index === -1) {
    throw new ApiError(404, `${String(resource)} record not found`);
  }

  const current = records[index] as TenantStore[K][number];
  const updated = {
    ...current,
    ...patch,
    id: current.id,
    tenantId
  } as TenantStore[K][number];

  records[index] = updated as TenantStore[K][number] & { id: number | string; tenantId: string };
  return structuredClone(updated) as TenantStore[K][number];
}

export function deleteRecord<K extends ResourceKey>(tenantId: string, resource: K, id: number | string) {
  const records = getTenantStore(tenantId)[resource] as Array<{ id: number | string; tenantId: string }>;
  const index = records.findIndex((entry) => entry.id === id && entry.tenantId === tenantId);

  if (index === -1) {
    throw new ApiError(404, `${String(resource)} record not found`);
  }

  const [removed] = records.splice(index, 1);
  return structuredClone(removed) as TenantStore[K][number];
}

export function findPrimaryUserId(tenantId: string) {
  return getTenantStore(tenantId).users[0]?.id ?? `${tenantId}-user`;
}

export function runTransfer(tenantId: string, input: Omit<TransferRecord, "id" | "tenantId" | "status" | "createdAt">) {
  const store = getTenantStore(tenantId);
  const fromAccount = store.accounts.find((account) => account.id === input.fromId);
  const toAccount = store.accounts.find((account) => account.id === input.toId);

  if (!fromAccount || !toAccount) {
    throw new ApiError(404, "Transfer accounts not found for tenant");
  }

  if (fromAccount.balance < input.amount) {
    throw new ApiError(400, "Insufficient funds");
  }

  fromAccount.balance -= input.amount;
  toAccount.balance += input.amount;

  const transfer = createRecord(tenantId, "transfers", {
    ...input,
    status: "completed",
    createdAt: now()
  });

  createRecord(tenantId, "transactions", {
    accountId: fromAccount.id,
    amount: -input.amount,
    description: `Transfer to ${toAccount.name}`,
    date: now(),
    category: "Transfer",
    status: "posted"
  });

  createRecord(tenantId, "transactions", {
    accountId: toAccount.id,
    amount: input.amount,
    description: `Transfer from ${fromAccount.name}`,
    date: now(),
    category: "Transfer",
    status: "posted"
  });

  return transfer;
}

export function payLoan(tenantId: string, loanId: number, amount: number) {
  const store = getTenantStore(tenantId);
  const loan = store.loans.find((entry) => entry.id === loanId);

  if (!loan) {
    throw new ApiError(404, "Loan not found");
  }

  loan.balance = Math.max(0, loan.balance - amount);
  return structuredClone(loan);
}

export function summarizeInsights(tenantId: string) {
  const store = getTenantStore(tenantId);
  const totalBalance = store.accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlySpend = store.transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  return {
    healthScore: 86,
    savingsRate: 0.23,
    totalBalance,
    monthlySpend,
    insights: structuredClone(store.insights)
  };
}

export function upsertUserProfile(
  tenantId: string,
  payload: Pick<UserProfile, "email" | "fullName"> & { role?: UserProfile["role"] }
) {
  const userId = `${tenantId}-user-${getTenantStore(tenantId).users.length + 1}`;

  return createRecord(tenantId, "users", {
    id: userId,
    email: payload.email,
    fullName: payload.fullName,
    role: payload.role ?? "member",
    createdAt: now()
  });
}

export function signOutSession(tenantId: string, sessionId: string) {
  return updateRecord(tenantId, "authSessions", sessionId, {
    status: "signed_out"
  });
}
