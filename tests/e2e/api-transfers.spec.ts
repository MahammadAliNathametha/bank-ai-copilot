import { test, expect } from "@playwright/test";

test.describe("API-TRF-GROUP: Transfers API Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank
  const tenantB = "22222222-2222-2222-2222-222222222222"; // Gujarat CU

  test("API-TRF-001: Internal transfer - Transfer between accounts updates balances", async ({ request }) => {
    // 1. Get two valid accounts for tenantA
    const accountsRes = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    const accounts = (await accountsRes.json()).data;
    expect(accounts.length).toBeGreaterThanOrEqual(2);
    
    const fromAccount = accounts[0];
    const toAccount = accounts[1];
    const transferAmount = 100;

    // 2. Perform transfer
    const response = await request.post("/api/transfers", {
      headers: { "x-tenant-id": tenantA },
      data: {
        fromId: fromAccount.id,
        toId: toAccount.id,
        amount: transferAmount,
        method: "internal"
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);

    // 3. Verify balances updated
    const fromUpdated = await request.get(`/api/accounts?id=${fromAccount.id}`, {
      headers: { "x-tenant-id": tenantA }
    });
    const toUpdated = await request.get(`/api/accounts?id=${toAccount.id}`, {
      headers: { "x-tenant-id": tenantA }
    });

    const fromAccNew = (await fromUpdated.json()).data;
    const toAccNew = (await toUpdated.json()).data;

    // Check balance difference (handling floating point if necessary, though these should be integers/fixed)
    expect(fromAccNew.balance).toBe(fromAccount.balance - transferAmount);
    expect(toAccNew.balance).toBe(toAccount.balance + transferAmount);
  });

  test("API-TRF-002: Cross tenant transfer - Blocked by tenant context", async ({ request }) => {
    // 1. Get an account from Tenant A and an account from Tenant B
    const accountsARes = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    const accountA = (await accountsARes.json()).data[0];

    const accountsBRes = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantB }
    });
    const accountB = (await accountsBRes.json()).data[0];

    // 2. Try to transfer from A to a non-existent account (or account from B that should not be found in A)
    const response = await request.post("/api/transfers", {
      headers: { "x-tenant-id": tenantA },
      data: {
        fromId: accountA.id,
        toId: 999999, // Definitely not in tenantA
        amount: 10,
        method: "internal"
      }
    });

    // Should fail because and ID not in tenantA's context should return 404
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error).toContain("not found");
  });

  test("API-TRF-003: Insufficient balance - Fails with appropriate error", async ({ request }) => {
    const accountsRes = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    const accounts = (await accountsRes.json()).data;
    const fromAccount = accounts[0];
    const toAccount = accounts[1];
    
    // Attempt to transfer more than balance
    const response = await request.post("/api/transfers", {
      headers: { "x-tenant-id": tenantA },
      data: {
        fromId: fromAccount.id,
        toId: toAccount.id,
        amount: fromAccount.balance + 1000000,
        method: "internal"
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/Insufficient funds/i);
  });

});
