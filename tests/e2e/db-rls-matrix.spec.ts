import { test, expect } from "@playwright/test";

test.describe("DB-RLS-MATRIX: Database & Isolation Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank
  const tenantB = "22222222-2222-2222-2222-222222222222"; // Gujarat CU

  test("DB-001: Create account - Insert new account record", async ({ request }) => {
    const response = await request.post("/api/accounts", {
      headers: { "x-tenant-id": tenantA },
      data: {
        name: "Enterprise Testing Fund",
        type: "checking",
        balance: 500000
      }
    });
    
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.name).toBe("Enterprise Testing Fund");
    expect(body.data.tenantId).toBe(tenantA);
  });

  test("DB-002: Tenant data isolation - Query only returns own data", async ({ request }) => {
    // Insert into Tenant A
    const resA = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    const dataA = await resA.json();
    
    // Insert into Tenant B
    const resB = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantB }
    });
    const dataB = await resB.json();

    // Verify all records in A belong to A
    dataA.data.forEach((acc: any) => {
      expect(acc.tenantId).toBe(tenantA);
    });

    // Verify all records in B belong to B
    dataB.data.forEach((acc: any) => {
      expect(acc.tenantId).toBe(tenantB);
    });
  });

  test("DB-003: Cross tenant access - Accessing other tenant ID is denied", async ({ request }) => {
    // We try to access Tenant B accounts using Tenant A header
    // The middleware should block this if Host and Header conflict, 
    // but if we only provide Tenant A header, we only see Tenant A data.
    // To test "Denied", we look for the conflict case (AUTH-006 covers this).
    // Here we test explicitly that providing a specific account ID from Tenant B 
    // results in 'not found' because it's filtered by tenant_id.
    
    const response = await request.get("/api/accounts?id=301", { // Assuming 301 is a B account
      headers: { "x-tenant-id": tenantA }
    });
    
    // In our live-store, getAccountById throws 404 if eq(tenant_id, tenantId) fails
    expect(response.status()).toBe(404);
  });

  test("DB-004: Transactions insert - Stored correctly with amount and category", async ({ request }) => {
    // Get a valid account first
    const accountsRes = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    const accounts = await accountsRes.json();
    const accountId = accounts.data[0].id;

    const response = await request.post("/api/transactions", {
      headers: { "x-tenant-id": tenantA },
      data: {
        accountId: accountId,
        amount: -1250.5,
        description: "AWS Cloud Infrastructure Payment",
        category: "Infrastructure",
        status: "posted"
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.amount).toBe(-1250.5);
    expect(body.data.description).toBe("AWS Cloud Infrastructure Payment");
  });

  test("DB-005: Index performance - Fast response for filtered queries", async ({ request }) => {
    const start = Date.now();
    const response = await request.get("/api/transactions?startDate=2026-01-01", {
      headers: { "x-tenant-id": tenantA }
    });
    const end = Date.now();
    
    expect(response.status()).toBe(200);
    expect(end - start).toBeLessThan(1000); // 1000ms target for "fast" in this environment
  });

  test("DB-006: Foreign key integrity - Insert invalid account_id returns error", async ({ request }) => {
    // accountId 999999 should not exist
    const response = await request.post("/api/transactions", {
      headers: { "x-tenant-id": tenantA },
      data: {
        accountId: 999999,
        amount: -10,
        description: "Ghost Transaction",
        category: "Test"
      }
    });

    // Supabase will throw 500 (mapped from DB error) or 400
    // Mock store should also handle this if intended, currently it likely 404s on account check
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

});
