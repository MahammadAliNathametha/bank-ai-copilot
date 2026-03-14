import * as mock from "@/lib/data/mock-bank-store";
import * as live from "@/lib/data/live-bank-store";

function shouldUseMockBankStore() {
  if (process.env.BANK_DATA_BACKEND === "mock" || process.env.NODE_ENV === "test") {
    return true;
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for live data access in production.");
    }
    return true;
  }

  return false;
}

export async function listUsers(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "users") : live.listUsers(tenantId);
}

export async function getUserById(tenantId: string, id: string) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "users", id) : live.getUserById(tenantId, id);
}

export async function createUser(tenantId: string, payload: Parameters<typeof live.createUser>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "users", {
        id: payload.id ?? `${tenantId}-user-${Date.now()}`,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role ?? "member",
        twoFactorEnabled: false,
        biometricEnabled: false,
        createdAt: new Date().toISOString()
      })
    : live.createUser(tenantId, payload);
}

export async function updateUser(tenantId: string, id: string, payload: Parameters<typeof live.updateUser>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "users", id, payload) : live.updateUser(tenantId, id, payload);
}

export async function deleteUser(tenantId: string, id: string) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "users", id) : live.deleteUser(tenantId, id);
}

export async function findPrimaryUserId(tenantId: string) {
  return shouldUseMockBankStore() ? mock.findPrimaryUserId(tenantId) : live.findPrimaryUserId(tenantId);
}

export async function listAccounts(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "accounts") : live.listAccounts(tenantId);
}

export async function getAccountById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "accounts", id) : live.getAccountById(tenantId, id);
}

export async function createAccount(tenantId: string, payload: Parameters<typeof live.createAccount>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "accounts", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createAccount(tenantId, payload);
}

export async function updateAccount(tenantId: string, id: number, payload: Parameters<typeof live.updateAccount>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "accounts", id, payload) : live.updateAccount(tenantId, id, payload);
}

export async function deleteAccount(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "accounts", id) : live.deleteAccount(tenantId, id);
}

export async function listTransactions(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "transactions") : live.listTransactions(tenantId);
}

export async function getTransactionById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "transactions", id) : live.getTransactionById(tenantId, id);
}

export async function createTransaction(tenantId: string, payload: Parameters<typeof live.createTransaction>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "transactions", payload) : live.createTransaction(tenantId, payload);
}

export async function updateTransaction(tenantId: string, id: number, payload: Parameters<typeof live.updateTransaction>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "transactions", id, payload) : live.updateTransaction(tenantId, id, payload);
}

export async function deleteTransaction(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "transactions", id) : live.deleteTransaction(tenantId, id);
}

export async function listTransfers(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "transfers") : live.listTransfers(tenantId);
}

export async function getTransferById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "transfers", id) : live.getTransferById(tenantId, id);
}

export async function updateTransfer(tenantId: string, id: number, payload: Parameters<typeof live.updateTransfer>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "transfers", id, payload) : live.updateTransfer(tenantId, id, payload);
}

export async function deleteTransfer(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "transfers", id) : live.deleteTransfer(tenantId, id);
}

export async function runTransfer(tenantId: string, payload: Parameters<typeof live.runTransfer>[1]) {
  return shouldUseMockBankStore() ? mock.runTransfer(tenantId, payload) : live.runTransfer(tenantId, payload);
}

export async function listBills(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "bills") : live.listBills(tenantId);
}

export async function getBillById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "bills", id) : live.getBillById(tenantId, id);
}

export async function createBill(tenantId: string, payload: Parameters<typeof live.createBill>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "bills", payload) : live.createBill(tenantId, payload);
}

export async function updateBill(tenantId: string, id: number, payload: Parameters<typeof live.updateBill>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "bills", id, payload) : live.updateBill(tenantId, id, payload);
}

export async function deleteBill(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "bills", id) : live.deleteBill(tenantId, id);
}

export async function listPayments(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "payments") : live.listPayments(tenantId);
}

export async function getPaymentById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "payments", id) : live.getPaymentById(tenantId, id);
}

export async function createPayment(tenantId: string, payload: Parameters<typeof live.createPayment>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "payments", payload) : live.createPayment(tenantId, payload);
}

export async function updatePayment(tenantId: string, id: number, payload: Parameters<typeof live.updatePayment>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "payments", id, payload) : live.updatePayment(tenantId, id, payload);
}

export async function deletePayment(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "payments", id) : live.deletePayment(tenantId, id);
}

export async function listCards(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "cards") : live.listCards(tenantId);
}

export async function getCardById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "cards", id) : live.getCardById(tenantId, id);
}

export async function createCard(tenantId: string, payload: Parameters<typeof live.createCard>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "cards", payload) : live.createCard(tenantId, payload);
}

export async function updateCard(tenantId: string, id: number, payload: Parameters<typeof live.updateCard>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "cards", id, payload) : live.updateCard(tenantId, id, payload);
}

export async function deleteCard(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "cards", id) : live.deleteCard(tenantId, id);
}

export async function listLoans(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "loans") : live.listLoans(tenantId);
}

export async function getLoanById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "loans", id) : live.getLoanById(tenantId, id);
}

export async function createLoan(tenantId: string, payload: Parameters<typeof live.createLoan>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "loans", payload) : live.createLoan(tenantId, payload);
}

export async function updateLoan(tenantId: string, id: number, payload: Parameters<typeof live.updateLoan>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "loans", id, payload) : live.updateLoan(tenantId, id, payload);
}

export async function deleteLoan(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "loans", id) : live.deleteLoan(tenantId, id);
}

export async function payLoan(tenantId: string, id: number, amount: number) {
  return shouldUseMockBankStore() ? mock.payLoan(tenantId, id, amount) : live.payLoan(tenantId, id, amount);
}

export async function listNotifications(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "notifications") : live.listNotifications(tenantId);
}

export async function getNotificationById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "notifications", id) : live.getNotificationById(tenantId, id);
}

export async function createNotification(tenantId: string, payload: Parameters<typeof live.createNotification>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "notifications", payload) : live.createNotification(tenantId, payload);
}

export async function updateNotification(tenantId: string, id: number, payload: Parameters<typeof live.updateNotification>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "notifications", id, payload) : live.updateNotification(tenantId, id, payload);
}

export async function deleteNotification(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "notifications", id) : live.deleteNotification(tenantId, id);
}

export async function listDocuments(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "documents") : live.listDocuments(tenantId);
}

export async function getDocumentById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "documents", id) : live.getDocumentById(tenantId, id);
}

export async function createDocument(tenantId: string, payload: Parameters<typeof live.createDocument>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "documents", payload) : live.createDocument(tenantId, payload);
}

export async function updateDocument(tenantId: string, id: number, payload: Parameters<typeof live.updateDocument>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "documents", id, payload) : live.updateDocument(tenantId, id, payload);
}

export async function deleteDocument(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "documents", id) : live.deleteDocument(tenantId, id);
}

export async function listInsights(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "insights") : live.listInsights(tenantId);
}

export async function getInsightById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "insights", id) : live.getInsightById(tenantId, id);
}

export async function createInsight(tenantId: string, payload: Parameters<typeof live.createInsight>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "insights", payload) : live.createInsight(tenantId, payload);
}

export async function updateInsight(tenantId: string, id: number, payload: Parameters<typeof live.updateInsight>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "insights", id, payload) : live.updateInsight(tenantId, id, payload);
}

export async function deleteInsight(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "insights", id) : live.deleteInsight(tenantId, id);
}

export async function summarizeInsights(tenantId: string) {
  return shouldUseMockBankStore() ? mock.summarizeInsights(tenantId) : live.summarizeInsights(tenantId);
}

export async function listComplianceRecords(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "compliance") : live.listComplianceRecords(tenantId);
}

export async function getComplianceRecordById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "compliance", id) : live.getComplianceRecordById(tenantId, id);
}

export async function createComplianceRecord(tenantId: string, payload: Parameters<typeof live.createComplianceRecord>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "compliance", payload)
    : live.createComplianceRecord(tenantId, payload);
}

export async function updateComplianceRecord(tenantId: string, id: number, payload: Parameters<typeof live.updateComplianceRecord>[2]) {
  return shouldUseMockBankStore()
    ? mock.updateRecord(tenantId, "compliance", id, payload)
    : live.updateComplianceRecord(tenantId, id, payload);
}

export async function deleteComplianceRecord(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "compliance", id) : live.deleteComplianceRecord(tenantId, id);
}

export async function listAdminMetrics(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "adminMetrics") : live.listAdminMetrics(tenantId);
}

export async function getAdminMetricById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "adminMetrics", id) : live.getAdminMetricById(tenantId, id);
}

export async function createAdminMetric(tenantId: string, payload: Parameters<typeof live.createAdminMetric>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "adminMetrics", payload)
    : live.createAdminMetric(tenantId, payload);
}

export async function updateAdminMetric(tenantId: string, id: number, payload: Parameters<typeof live.updateAdminMetric>[2]) {
  return shouldUseMockBankStore()
    ? mock.updateRecord(tenantId, "adminMetrics", id, payload)
    : live.updateAdminMetric(tenantId, id, payload);
}

export async function deleteAdminMetric(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "adminMetrics", id) : live.deleteAdminMetric(tenantId, id);
}

export async function listSupportTickets(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "supportTickets") : live.listSupportTickets(tenantId);
}

export async function getSupportTicketById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "supportTickets", id) : live.getSupportTicketById(tenantId, id);
}

export async function createSupportTicket(tenantId: string, payload: Parameters<typeof live.createSupportTicket>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "supportTickets", payload) : live.createSupportTicket(tenantId, payload);
}

export async function updateSupportTicket(tenantId: string, id: number, payload: Parameters<typeof live.updateSupportTicket>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "supportTickets", id, payload) : live.updateSupportTicket(tenantId, id, payload);
}

export async function deleteSupportTicket(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "supportTickets", id) : live.deleteSupportTicket(tenantId, id);
}

export async function listLocations(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "locations") : live.listLocations(tenantId);
}

export async function getLocationById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "locations", id) : live.getLocationById(tenantId, id);
}

export async function createLocation(tenantId: string, payload: Parameters<typeof live.createLocation>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "locations", payload) : live.createLocation(tenantId, payload);
}

export async function updateLocation(tenantId: string, id: number, payload: Parameters<typeof live.updateLocation>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "locations", id, payload) : live.updateLocation(tenantId, id, payload);
}

export async function deleteLocation(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "locations", id) : live.deleteLocation(tenantId, id);
}

export async function listOpenConnections(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "openConnections") : live.listOpenConnections(tenantId);
}

export async function getOpenConnectionById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "openConnections", id) : live.getOpenConnectionById(tenantId, id);
}

export async function createOpenConnection(tenantId: string, payload: Parameters<typeof live.createOpenConnection>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "openConnections", payload)
    : live.createOpenConnection(tenantId, payload);
}

export async function updateOpenConnection(tenantId: string, id: number, payload: Parameters<typeof live.updateOpenConnection>[2]) {
  return shouldUseMockBankStore()
    ? mock.updateRecord(tenantId, "openConnections", id, payload)
    : live.updateOpenConnection(tenantId, id, payload);
}

export async function deleteOpenConnection(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "openConnections", id) : live.deleteOpenConnection(tenantId, id);
}

export async function listWebhookEvents(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "webhooks") : live.listWebhookEvents(tenantId);
}

export async function getWebhookEventById(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.getRecordById(tenantId, "webhooks", id) : live.getWebhookEventById(tenantId, id);
}

export async function createWebhookEvent(tenantId: string, payload: Parameters<typeof live.createWebhookEvent>[1]) {
  return shouldUseMockBankStore() ? mock.createRecord(tenantId, "webhooks", payload) : live.createWebhookEvent(tenantId, payload);
}

export async function updateWebhookEvent(tenantId: string, id: number, payload: Parameters<typeof live.updateWebhookEvent>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "webhooks", id, payload) : live.updateWebhookEvent(tenantId, id, payload);
}

export async function deleteWebhookEvent(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "webhooks", id) : live.deleteWebhookEvent(tenantId, id);
}

export async function getAuthSession(tenantId: string, sessionId?: string) {
  return shouldUseMockBankStore()
    ? (sessionId ? mock.getRecordById(tenantId, "authSessions", sessionId) : mock.listRecords(tenantId, "authSessions")[0])
    : live.getAuthSession(tenantId, sessionId);
}

export async function createAuthSession(tenantId: string, email: string, userId?: string) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "authSessions", {
        userId: userId ?? mock.findPrimaryUserId(tenantId),
        email,
        status: "active",
        createdAt: new Date().toISOString()
      })
    : live.createAuthSession(tenantId, email, userId);
}

export async function signOutSession(tenantId: string, sessionId: string) {
  return shouldUseMockBankStore() ? mock.signOutSession(tenantId, sessionId) : live.signOutSession(tenantId, sessionId);
}

export async function listDevices(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "devices") : live.listDevices(tenantId);
}

export async function updateDevice(tenantId: string, id: number, payload: Parameters<typeof live.updateDevice>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "devices", id, payload) : live.updateDevice(tenantId, id, payload);
}

export async function deleteDevice(tenantId: string, id: number) {
  return shouldUseMockBankStore() ? mock.deleteRecord(tenantId, "devices", id) : live.deleteDevice(tenantId, id);
}

export async function listFraudEvents(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "fraudEvents") : live.listFraudEvents(tenantId);
}

export async function updateFraudEvent(tenantId: string, id: number, payload: Parameters<typeof live.updateFraudEvent>[2]) {
  return shouldUseMockBankStore() ? mock.updateRecord(tenantId, "fraudEvents", id, payload) : live.updateFraudEvent(tenantId, id, payload);
}

export async function listMarketingCampaigns(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "marketingCampaigns") : live.listMarketingCampaigns(tenantId);
}

export async function createMarketingCampaign(tenantId: string, payload: Parameters<typeof live.createMarketingCampaign>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "marketingCampaigns", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createMarketingCampaign(tenantId, payload);
}

export async function updateMarketingCampaign(tenantId: string, id: number, payload: Parameters<typeof live.updateMarketingCampaign>[2]) {
  return shouldUseMockBankStore()
    ? mock.updateRecord(tenantId, "marketingCampaigns", id, payload)
    : live.updateMarketingCampaign(tenantId, id, payload);
}

export async function listAppointments(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "appointments") : live.listAppointments(tenantId);
}

export async function createAppointment(tenantId: string, payload: Parameters<typeof live.createAppointment>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "appointments", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createAppointment(tenantId, payload);
}

export async function listSupportMessages(tenantId: string, ticketId?: number) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "supportMessages").filter((message) => (ticketId ? message.ticketId === ticketId : true))
    : live.listSupportMessages(tenantId, ticketId);
}

export async function createSupportMessage(tenantId: string, payload: Parameters<typeof live.createSupportMessage>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "supportMessages", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createSupportMessage(tenantId, payload);
}

export async function listAccountMembers(tenantId: string, accountId?: number) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "accountMembers").filter((member) => (accountId ? member.accountId === accountId : true))
    : live.listAccountMembers(tenantId, accountId);
}

export async function createAccountMember(tenantId: string, payload: Parameters<typeof live.createAccountMember>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "accountMembers", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createAccountMember(tenantId, payload);
}

export async function listInvestmentAccounts(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "investmentAccounts") : live.listInvestmentAccounts(tenantId);
}

export async function createInvestmentAccount(tenantId: string, payload: Parameters<typeof live.createInvestmentAccount>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "investmentAccounts", {
        ...payload,
        lastSyncedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      })
    : live.createInvestmentAccount(tenantId, payload);
}

export async function listCryptoAssets(tenantId: string) {
  return shouldUseMockBankStore() ? mock.listRecords(tenantId, "cryptoAssets") : live.listCryptoAssets(tenantId);
}

export async function listCryptoHoldings(tenantId: string, userId?: string) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "cryptoHoldings").filter((holding) => (userId ? holding.userId === userId : true))
    : live.listCryptoHoldings(tenantId, userId);
}

export async function listCryptoTrades(tenantId: string, userId?: string) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "cryptoTrades").filter((trade) => (userId ? trade.userId === userId : true))
    : live.listCryptoTrades(tenantId, userId);
}

export async function createCryptoTrade(tenantId: string, payload: Parameters<typeof live.createCryptoTrade>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "cryptoTrades", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createCryptoTrade(tenantId, payload);
}

export async function listWalletCards(tenantId: string, userId?: string) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "walletCards").filter((card) => (userId ? card.userId === userId : true))
    : live.listWalletCards(tenantId, userId);
}

export async function createWalletCard(tenantId: string, payload: Parameters<typeof live.createWalletCard>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "walletCards", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createWalletCard(tenantId, payload);
}

export async function listWalletActivity(tenantId: string, userId?: string) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "walletActivity").filter((activity) => (userId ? activity.userId === userId : true))
    : live.listWalletActivity(tenantId, userId);
}

export async function listWalletLoyalty(tenantId: string, userId?: string) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "walletLoyalty").filter((reward) => (userId ? reward.userId === userId : true))
    : live.listWalletLoyalty(tenantId, userId);
}

export async function listCreditScores(tenantId: string, userId?: string) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "creditScores").filter((score) => (userId ? score.userId === userId : true))
    : live.listCreditScores(tenantId, userId);
}

export async function createCreditScore(tenantId: string, payload: Parameters<typeof live.createCreditScore>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "creditScores", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createCreditScore(tenantId, payload);
}

export async function listSavingsRules(tenantId: string, userId?: string) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "savingsRules").filter((rule) => (userId ? rule.userId === userId : true))
    : live.listSavingsRules(tenantId, userId);
}

export async function createSavingsRule(tenantId: string, payload: Parameters<typeof live.createSavingsRule>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "savingsRules", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createSavingsRule(tenantId, payload);
}

export async function listVoiceCommands(tenantId: string, userId?: string) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "voiceCommands").filter((command) => (userId ? command.userId === userId : true))
    : live.listVoiceCommands(tenantId, userId);
}

export async function createVoiceCommand(tenantId: string, payload: Parameters<typeof live.createVoiceCommand>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "voiceCommands", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createVoiceCommand(tenantId, payload);
}

export async function listChatbotMessages(tenantId: string, sessionId?: string) {
  return shouldUseMockBankStore()
    ? mock.listRecords(tenantId, "chatbotMessages").filter((message) => (sessionId ? message.sessionId === sessionId : true))
    : live.listChatbotMessages(tenantId, sessionId);
}

export async function createChatbotMessage(tenantId: string, payload: Parameters<typeof live.createChatbotMessage>[1]) {
  return shouldUseMockBankStore()
    ? mock.createRecord(tenantId, "chatbotMessages", {
        ...payload,
        createdAt: new Date().toISOString()
      })
    : live.createChatbotMessage(tenantId, payload);
}
