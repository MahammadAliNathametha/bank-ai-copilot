import { expect, test, type APIRequestContext } from "@playwright/test";

import { demoTenants } from "@/lib/data/demo";

const accountsRoute = "/api/accounts";
const transfersRoute = "/api/transfers";

test.describe("tenant isolation & transfer consistency", () => {
  const [tenantA, tenantB] = demoTenants;
  const headersFor = (tenantId: string) => ({ "x-tenant-id": tenantId });

  async function fetchAccounts(request: APIRequestContext, tenantId: string) {
    const response = await request.get(accountsRoute, { headers: headersFor(tenantId) });
    expect(response.ok()).toBe(true);
    const payload = (await response.json()) as {
      success: boolean;
      tenantId: string;
      data: Array<{ tenantId: string; balance: number; id: number }>;
    };
    expect(payload.success).toBe(true);
    expect(payload.tenantId).toBe(tenantId);
    expect(payload.data.every((account) => account.tenantId === tenantId)).toBe(true);
    return payload.data;
  }

  test("accounts are scoped per tenant", async ({ request }) => {
    const tenantAAccounts = await fetchAccounts(request, tenantA.id);
    const tenantBAccounts = await fetchAccounts(request, tenantB.id);

    expect(tenantAAccounts.length).toBeGreaterThan(0);
    expect(tenantBAccounts.length).toBeGreaterThan(0);
    expect(tenantAAccounts.every((account) => tenantBAccounts.every((b) => b.id !== account.id))).toBe(true);
  });

  test("running a transfer updates the tenant balances only once", async ({ request }) => {
    const before = await fetchAccounts(request, tenantA.id);
    const fromAccount = before[0];
    const toAccount = before[1] ?? before[0];
    const amount = 150;

    const transferResponse = await request.post(transfersRoute, {
      headers: headersFor(tenantA.id),
      data: {
        fromId: fromAccount.id,
        toId: toAccount.id,
        amount,
        method: "internal"
      }
    });

    expect(transferResponse.status()).toBe(201);
    const transferPayload = (await transferResponse.json()) as {
      data: { status: string; fromId: number; toId: number; amount: number };
    };
    expect(transferPayload.data.status).toBe("completed");
    expect(transferPayload.data.amount).toBe(amount);

    const after = await fetchAccounts(request, tenantA.id);
    const updatedFrom = after.find((account) => account.id === fromAccount.id);
    const updatedTo = after.find((account) => account.id === toAccount.id);

    expect(updatedFrom).toBeDefined();
    expect(updatedTo).toBeDefined();
    expect(updatedFrom!.balance).toBeCloseTo(fromAccount.balance - amount, 2);
    expect(updatedTo!.balance).toBeCloseTo(toAccount.balance + amount, 2);

    const otherTenantAccounts = await fetchAccounts(request, tenantB.id);
    expect(otherTenantAccounts.every((account) => account.balance !== updatedFrom!.balance)).toBe(true);
  });
});
