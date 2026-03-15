import { beforeEach, describe, expect, it } from "vitest";

import { demoTenants } from "@/lib/data/demo";
import {
  createRecord,
  listRecords,
  resetMockBankStore,
  runTransfer
} from "@/lib/data/mock-bank-store";
import { logAuditEvent } from "@/lib/services/audit";
import { ApiError, parseJson, withTenantRoute } from "@/lib/services/api";
import { z } from "zod";

describe("platform integration tests", () => {
  const now = new Date().toISOString();

  beforeEach(() => {
    resetMockBankStore();
  });

  it("keeps tenant data isolated in the mock store", () => {
    const now = new Date().toISOString();
    createRecord(demoTenants[0].id, "accounts", {
      userId: `${demoTenants[0].id}-user`,
      name: "Tenant Only Account",
      type: "checking",
      balance: 100,
      currency: "USD",
      createdAt: now
    });

    const tenantOneAccounts = listRecords(demoTenants[0].id, "accounts");
    const tenantTwoAccounts = listRecords(demoTenants[1].id, "accounts");

    expect(tenantOneAccounts.some((account) => account.tenantId === demoTenants[0].id)).toBe(true);
    expect(tenantTwoAccounts.every((account) => account.tenantId === demoTenants[1].id)).toBe(true);
    expect(tenantTwoAccounts).toHaveLength(2);
  });

  it("updates balances when a transfer executes", () => {
    const transfer = runTransfer(demoTenants[0].id, {
      fromId: 1,
      toId: 2,
      amount: 200,
      method: "internal"
    });

    const checking = listRecords(demoTenants[0].id, "accounts").find((a) => a.id === 1);
    const savings = listRecords(demoTenants[0].id, "accounts").find((a) => a.id === 2);

    expect(transfer.status).toBe("completed");
    expect(checking?.balance).toBeCloseTo(3320.11);
    expect(savings?.balance).toBeCloseTo(14420.54);
  });

  it("persists a tenant transaction when created through the mock store", () => {
    createRecord(demoTenants[1].id, "transactions", {
      accountId: 1,
      amount: -42.5,
      description: "Test transaction",
      category: "testing",
      status: "posted",
      date: now
    });

    const transactions = listRecords(demoTenants[1].id, "transactions");
    expect(transactions.some((tx) => tx.description === "Test transaction")).toBe(true);
    expect(transactions.every((tx) => tx.tenantId === demoTenants[1].id)).toBe(true);
  });

  it("rejects invalid JSON payloads before validation", async () => {
    const request = new Request("https://bank/api/sample", {
      method: "POST",
      body: "not-json"
    });

    await expect(parseJson(request, z.object({ foo: z.string() }))).rejects.toBeInstanceOf(ApiError);
  });

  it("logs audit events with structured details in mock mode", async () => {
    const details = { event: "test", value: 9 };
    await logAuditEvent({
      tenantId: demoTenants[0].id,
      action: "test:event",
      userId: null,
      details
    });

    const logs = listRecords(demoTenants[0].id, "auditLogs");
    expect(logs.at(-1)?.details).toMatchObject(details);
  });

  it("enforces tenant context in withTenantRoute", async () => {
    const request = new Request("http://example.com/api/accounts", {
      headers: { "x-tenant-id": demoTenants[1].id },
      method: "GET"
    });

    const handler = async ({ tenantId }: { tenantId: string }) => ({
      data: listRecords(tenantId, "accounts")
    });

    const response = await withTenantRoute(request, handler);
    const payload = (await response.json()) as { success: boolean; tenantId: string; data: Array<{ tenantId: string }> };

    expect(payload.success).toBe(true);
    expect(payload.tenantId).toBe(demoTenants[1].id);
    expect(payload.data.every((account) => account.tenantId === demoTenants[1].id)).toBe(true);
  });
});
