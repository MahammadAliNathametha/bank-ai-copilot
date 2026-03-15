import { test, expect } from "@playwright/test";

test.describe("API-ACC-GROUP: Accounts API Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank
  const tenantB = "22222222-2222-2222-2222-222222222222"; // Gujarat CU

  test("API-ACC-001: Get accounts - Should return a list of accounts", async ({ request }) => {
    const response = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    if (body.data.length > 0) {
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("balance");
    }
  });

  test("API-ACC-002: Create account - Should create a new account successfully", async ({ request }) => {
    const accountName = `API Test Account ${Date.now()}`;
    const response = await request.post("/api/accounts", {
      headers: { "x-tenant-id": tenantA },
      data: {
        name: accountName,
        type: "savings",
        balance: 1000.5
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.name).toBe(accountName);
    expect(body.data.balance).toBe(1000.5);
    expect(body.data.tenantId).toBe(tenantA);
  });

  test("API-ACC-003: Tenant filter - Should only return accounts for the specified tenant", async ({ request }) => {
    // Request accounts for Tenant A
    const resA = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    const bodyA = await resA.json();
    
    // Request accounts for Tenant B
    const resB = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantB }
    });
    const bodyB = await resB.json();

    // Verify cross-tenant isolation in response bodies
    bodyA.data.forEach((acc: any) => {
      expect(acc.tenantId).toBe(tenantA);
    });

    bodyB.data.forEach((acc: any) => {
      expect(acc.tenantId).toBe(tenantB);
    });
  });

  test("API-ACC-004: Invalid request - Missing fields should trigger Zod validation error", async ({ request }) => {
    const response = await request.post("/api/accounts", {
      headers: { "x-tenant-id": tenantA },
      data: {
        // Missing 'name' and 'type'
        balance: 500
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    // The API returns "Validation failed" for Zod errors
    expect(body.error).toMatch(/Validation failed/i);
    // Optionally check details if needed
    expect(body.details).toBeDefined();
  });

});
