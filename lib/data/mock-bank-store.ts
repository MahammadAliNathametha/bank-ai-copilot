import { demoTenants } from "@/lib/data/demo";
import { ApiError } from "@/lib/services/api";

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: "member" | "admin";
  tenantId: string;
  createdAt: string;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
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
  method: "internal" | "external" | "ach" | "fednow" | "rtp";
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

export type PayeeRecord = {
  id: number;
  name: string;
  accountNumber?: string;
  routingNumber?: string;
  userId: string;
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

export type BeneficiaryRecord = {
  id: number;
  userId: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
  type: "individual" | "business";
  tenantId: string;
  createdAt: string;
};

export type DeviceRecord = {
  id: number;
  userId: string;
  name: string;
  type: "mobile" | "desktop" | "browser";
  os: string;
  lastSeen: string;
  location: string;
  trusted: boolean;
  tenantId: string;
  createdAt: string;
};

export type FraudEventRecord = {
  id: number;
  userId: string;
  type: string;
  severity: "high" | "medium" | "low";
  description: string;
  status: "blocked" | "reviewed" | "cleared";
  location: string;
  ip: string;
  tenantId: string;
  createdAt: string;
};

export type AuditLogRecord = {
  id: number;
  action: string;
  userId: string | null;
  tenantId: string;
  createdAt: string;
  details?: Record<string, unknown> | null;
};

export type MarketingCampaignRecord = {
  id: number;
  name: string;
  channel: "push" | "email" | "sms" | "in-app";
  status: "active" | "paused" | "scheduled" | "completed";
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
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

export type AppointmentRecord = {
  id: number;
  userId: string;
  locationName: string;
  timeSlot: string;
  agenda: string;
  status: "requested" | "confirmed" | "completed" | "cancelled";
  tenantId: string;
  createdAt: string;
};

export type SupportMessageRecord = {
  id: number;
  ticketId: number;
  sender: "user" | "agent" | "bot";
  message: string;
  tenantId: string;
  createdAt: string;
};

export type AccountMemberRecord = {
  id: number;
  accountId: number;
  userId: string;
  role: "owner" | "editor" | "viewer";
  tenantId: string;
  createdAt: string;
};

export type InvestmentAccountRecord = {
  id: number;
  userId: string;
  provider: string;
  accountName: string;
  balance: number;
  type: "brokerage" | "retirement";
  status: "active" | "paused";
  lastSyncedAt: string;
  tenantId: string;
  createdAt: string;
};

export type CryptoAssetRecord = {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  tenantId: string;
  createdAt: string;
};

export type CryptoHoldingRecord = {
  id: number;
  assetId: number;
  userId: string;
  balance: number;
  tenantId: string;
  createdAt: string;
};

export type CryptoTradeRecord = {
  id: number;
  assetId: number;
  userId: string;
  side: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  status: "completed" | "pending" | "cancelled";
  executedAt: string;
  tenantId: string;
  createdAt: string;
};

export type WalletCardRecord = {
  id: number;
  userId: string;
  walletType: string;
  last4: string;
  brand: string;
  status: "active" | "suspended";
  addedAt: string;
  tenantId: string;
  createdAt: string;
};

export type WalletActivityRecord = {
  id: number;
  userId: string;
  merchant: string;
  method: string;
  amount: number;
  category: string;
  occurredAt: string;
  tenantId: string;
  createdAt: string;
};

export type WalletLoyaltyRecord = {
  id: number;
  userId: string;
  program: string;
  points: number;
  tier: string;
  tenantId: string;
  createdAt: string;
};

export type CreditScoreRecord = {
  id: number;
  userId: string;
  score: number;
  provider: string;
  status: "current" | "stale";
  reportedAt: string;
  tenantId: string;
  createdAt: string;
};

export type SavingsRuleRecord = {
  id: number;
  userId: string;
  name: string;
  cadence: "daily" | "weekly" | "monthly";
  amount: number;
  target: number;
  status: "active" | "paused";
  tenantId: string;
  createdAt: string;
};

export type VoiceCommandRecord = {
  id: number;
  userId: string;
  command: string;
  transcript: string;
  response: string;
  status: "processed" | "failed";
  tenantId: string;
  createdAt: string;
};

export type ChatbotMessageRecord = {
  id: number;
  sessionId: string;
  userId: string;
  role: "user" | "assistant";
  message: string;
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
  beneficiaries: BeneficiaryRecord[];
  devices: DeviceRecord[];
  fraudEvents: FraudEventRecord[];
  auditLogs: AuditLogRecord[];
  marketingCampaigns: MarketingCampaignRecord[];
  appointments: AppointmentRecord[];
  supportMessages: SupportMessageRecord[];
  accountMembers: AccountMemberRecord[];
  investmentAccounts: InvestmentAccountRecord[];
  cryptoAssets: CryptoAssetRecord[];
  cryptoHoldings: CryptoHoldingRecord[];
  cryptoTrades: CryptoTradeRecord[];
  walletCards: WalletCardRecord[];
  walletActivity: WalletActivityRecord[];
  walletLoyalty: WalletLoyaltyRecord[];
  creditScores: CreditScoreRecord[];
  savingsRules: SavingsRuleRecord[];
  voiceCommands: VoiceCommandRecord[];
  chatbotMessages: ChatbotMessageRecord[];
  payees: PayeeRecord[];
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
        email: `member@${tenantName.toLowerCase().replaceAll(/\s+/g, "")}.test`,
        status: "active",
        tenantId,
        createdAt: now()
      }
    ],
    users: [
      {
        id: primaryUserId,
        email: `member@${tenantName.toLowerCase().replaceAll(/\s+/g, "")}.test`,
        fullName: `${tenantName} Member`,
        role: "member",
        tenantId,
        createdAt: now(),
        twoFactorEnabled: true,
        biometricEnabled: false
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
    beneficiaries: [
      { id: 1, userId: primaryUserId, name: "Jane Doe", accountNumber: "****5678", routingNumber: "123456789", type: "individual", tenantId, createdAt: now() }
    ],
    devices: [
      { id: 1, userId: primaryUserId, name: "iPhone 15 Pro", type: "mobile", os: "iOS 18.2", lastSeen: "2 min ago", location: "New York, NY", trusted: true, tenantId, createdAt: now() },
      { id: 2, userId: primaryUserId, name: "MacBook Pro M3", type: "desktop", os: "macOS 15.1", lastSeen: "Active now", location: "New York, NY", trusted: true, tenantId, createdAt: now() }
    ],
    fraudEvents: [
      { id: 1, userId: primaryUserId, type: "Unusual login attempt", severity: "high", description: "Login attempt from London, UK blocked — location mismatch.", status: "blocked", location: "London, UK", ip: "85.14.***", tenantId, createdAt: now() }
    ],
    auditLogs: [],
    marketingCampaigns: [
      { id: 1, name: "Spring Savings Promo", channel: "push", status: "active", audience: 12450, sent: 11800, opened: 4720, clicked: 1890, converted: 378, budget: 5000, spent: 3200, startDate: "2026-03-01", endDate: "2026-03-31", tenantId, createdAt: now() },
      { id: 2, name: "Credit Card Upgrade", channel: "email", status: "active", audience: 8300, sent: 8300, opened: 3320, clicked: 1162, converted: 245, budget: 3000, spent: 1500, startDate: "2026-03-05", endDate: "2026-04-05", tenantId, createdAt: now() }
    ],
    appointments: [
      { id: 1, userId: primaryUserId, locationName: "Downtown Branch", timeSlot: "2026-03-20 11:00", agenda: "Discuss account options and service upgrades", status: "requested", tenantId, createdAt: now() }
    ],
    supportMessages: [
      { id: 1, ticketId: 1, sender: "user", message: "Please review my dispute.", tenantId, createdAt: now() },
      { id: 2, ticketId: 1, sender: "agent", message: "We are reviewing your case now.", tenantId, createdAt: now() }
    ],
    accountMembers: [
      { id: 1, accountId: 1, userId: primaryUserId, role: "owner", tenantId, createdAt: now() }
    ],
    investmentAccounts: [
      { id: 1, userId: primaryUserId, provider: "Apex Clearing", accountName: "Core Brokerage", balance: 18450.22, type: "brokerage", status: "active", lastSyncedAt: now(), tenantId, createdAt: now() }
    ],
    cryptoAssets: [
      { id: 1, symbol: "BTC", name: "Bitcoin", price: 91302.47, change24h: 6.71, tenantId, createdAt: now() },
      { id: 2, symbol: "ETH", name: "Ethereum", price: 3412.85, change24h: 4.23, tenantId, createdAt: now() }
    ],
    cryptoHoldings: [
      { id: 1, assetId: 1, userId: primaryUserId, balance: 0.4821, tenantId, createdAt: now() }
    ],
    cryptoTrades: [
      { id: 1, assetId: 1, userId: primaryUserId, side: "buy", amount: 0.05, price: 89100, total: 4455, status: "completed", executedAt: "2026-03-12T08:00:00.000Z", tenantId, createdAt: now() }
    ],
    walletCards: [
      { id: 1, userId: primaryUserId, walletType: "Apple Pay", last4: "4829", brand: "Visa", status: "active", addedAt: "2026-01-01T00:00:00.000Z", tenantId, createdAt: now() },
      { id: 2, userId: primaryUserId, walletType: "Google Pay", last4: "7391", brand: "Mastercard", status: "active", addedAt: "2026-02-01T00:00:00.000Z", tenantId, createdAt: now() }
    ],
    walletActivity: [
      { id: 1, userId: primaryUserId, merchant: "Starbucks", method: "Apple Pay", amount: -5.75, category: "Food & Drink", occurredAt: "2026-03-14T08:32:00.000Z", tenantId, createdAt: now() },
      { id: 2, userId: primaryUserId, merchant: "Uber", method: "Google Pay", amount: -23.4, category: "Transport", occurredAt: "2026-03-14T07:15:00.000Z", tenantId, createdAt: now() }
    ],
    walletLoyalty: [
      { id: 1, userId: primaryUserId, program: "Delta SkyMiles", points: 42850, tier: "Gold", tenantId, createdAt: now() },
      { id: 2, userId: primaryUserId, program: "Marriott Bonvoy", points: 128400, tier: "Platinum", tenantId, createdAt: now() }
    ],
    creditScores: [
      { id: 1, userId: primaryUserId, score: 742, provider: "Equifax", status: "current", reportedAt: "2026-03-10T00:00:00.000Z", tenantId, createdAt: now() }
    ],
    savingsRules: [
      { id: 1, userId: primaryUserId, name: "Round-ups", cadence: "daily", amount: 12.5, target: 20000, status: "active", tenantId, createdAt: now() }
    ],
    voiceCommands: [
      { id: 1, userId: primaryUserId, command: "Check my balance", transcript: "Check my balance", response: "Your total balance is $17,740.65.", status: "processed", tenantId, createdAt: now() }
    ],
    chatbotMessages: [
      { id: 1, sessionId: `${tenantId}-chat-1`, userId: primaryUserId, role: "assistant", message: "Welcome back! How can I help?", tenantId, createdAt: now() }
    ],
    payees: [],
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
      openConnections: 1,
      beneficiaries: 1,
      devices: 2,
      fraudEvents: 1,
      auditLogs: 0,
      marketingCampaigns: 2,
      appointments: 1,
      supportMessages: 2,
      accountMembers: 1,
      investmentAccounts: 1,
      cryptoAssets: 2,
      cryptoHoldings: 1,
      cryptoTrades: 1,
      walletCards: 2,
      walletActivity: 2,
      walletLoyalty: 2,
      creditScores: 1,
      savingsRules: 1,
      voiceCommands: 1,
      chatbotMessages: 1,
      payees: 0
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

  globalStore[STORE_KEY] ??= createInitialStore();

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
  return structuredClone(records);
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
  return structuredClone(record);
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
  return structuredClone(updated);
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
  if (input.fromId === input.toId) {
    throw new ApiError(400, "Cannot transfer to the same account");
  }

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
    createdAt: now(),
    twoFactorEnabled: false,
    biometricEnabled: false
  });
}

export function signOutSession(tenantId: string, sessionId: string) {
  return updateRecord(tenantId, "authSessions", sessionId, {
    status: "signed_out"
  });
}
