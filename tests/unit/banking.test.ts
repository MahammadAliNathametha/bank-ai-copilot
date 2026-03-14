import { beforeEach, describe, expect, it } from "vitest";

import { demoTenants } from "@/lib/data/demo";
import {
  createRecord,
  getRecordById,
  listRecords,
  resetMockBankStore,
  runTransfer
} from "@/lib/data/mock-bank-store";
import { GET as getAccounts } from "@/app/api/accounts/route";
import { GET as getAdminMigrate } from "@/app/api/admin/migrate/route";
import { analyzeCheckDeposit } from "@/lib/services/check-deposit";
import { transferSchema } from "@/lib/validations/banking";

describe("banking validation", () => {
  beforeEach(() => {
    resetMockBankStore();
  });

  it("accepts a valid transfer", () => {
    const result = transferSchema.safeParse({
      fromId: 1,
      toId: 2,
      amount: 250.5,
      method: "internal"
    });

    expect(result.success).toBe(true);
  });

  it("rejects non-positive transfers", () => {
    const result = transferSchema.safeParse({
      fromId: 1,
      toId: 2,
      amount: 0,
      method: "internal"
    });

    expect(result.success).toBe(false);
  });

  it("keeps tenant ids unique in demo data", () => {
    expect(new Set(demoTenants.map((tenant) => tenant.id)).size).toBe(demoTenants.length);
  });

  it("keeps records isolated per tenant", () => {
    createRecord(demoTenants[0].id, "payments", {
      recipient: "Alpha",
      amount: 25,
      channel: "p2p",
      status: "processing",
      createdAt: "2026-03-14T00:00:00.000Z"
    });

    expect(listRecords(demoTenants[0].id, "payments")).toHaveLength(1);
    expect(listRecords(demoTenants[1].id, "payments")).toHaveLength(0);
  });

  it("updates balances when a transfer is executed", () => {
    const transfer = runTransfer(demoTenants[0].id, {
      fromId: 1,
      toId: 2,
      amount: 100,
      method: "internal"
    });

    const checking = getRecordById(demoTenants[0].id, "accounts", 1);
    const savings = getRecordById(demoTenants[0].id, "accounts", 2);

    expect(transfer.status).toBe("completed");
    expect(checking.balance).toBeCloseTo(3420.11);
    expect(savings.balance).toBeCloseTo(14320.54);
  });

  it("returns tenant-scoped account responses from the route layer", async () => {
    const request = new Request("http://tenant.test/api/accounts", {
      headers: {
        "x-tenant-id": demoTenants[1].id
      }
    });

    const response = await getAccounts(request);
    const payload = (await response.json()) as {
      success: boolean;
      tenantId: string;
      data: Array<{ tenantId: string }>;
    };

    expect(payload.success).toBe(true);
    expect(payload.tenantId).toBe(demoTenants[1].id);
    expect(payload.data.every((account) => account.tenantId === demoTenants[1].id)).toBe(true);
  });

  it("returns migration status instead of a stub response", async () => {
    const request = new Request("http://tenant.test/api/admin/migrate", {
      headers: {
        "x-tenant-id": demoTenants[0].id
      }
    });

    const response = await getAdminMigrate(request);
    const payload = (await response.json()) as {
      success: boolean;
      tenantId: string;
      data: {
        action: string;
        ready: boolean;
        migrationCount: number;
        latestMigration: string | null;
        migrations: string[];
      };
    };

    expect(payload.success).toBe(true);
    expect(payload.tenantId).toBe(demoTenants[0].id);
    expect(payload.data.action).toBe("status");
    expect(payload.data.migrationCount).toBeGreaterThan(0);
    expect(payload.data.latestMigration).toBe(payload.data.migrations.at(-1) ?? null);
  });

  it("simulates OCR review for high-value checks", async () => {
    const analysis = await analyzeCheckDeposit(
      new File(["test-check-image"], "acme-payroll-check.png", { type: "image/png" }),
      6000
    );

    expect(analysis.manualReview).toBe(true);
    expect(analysis.payerName).toContain("Acme");
    expect(analysis.confidence).toBeLessThan(0.8);
    expect(analysis.reason).toContain("manual review");
  });
});
