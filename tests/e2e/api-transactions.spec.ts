import { test, expect } from "@playwright/test";

test.describe("API-TXN-GROUP: Transactions API Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  test("API-TXN-001: Create transaction - Should store transaction correctly", async ({ request }) => {
    // 1. Get a valid account first
    const accountsRes = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    const accounts = await accountsRes.json();
    const accountId = accounts.data[0].id;

    // 2. Create transaction
    const response = await request.post("/api/transactions", {
      headers: { "x-tenant-id": tenantA },
      data: {
        accountId,
        amount: -45.99,
        description: "Starbucks Coffee",
        category: "Food",
        status: "pending"
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.description).toBe("Starbucks Coffee");
    expect(body.data.amount).toBe(-45.99);
  });

  test("API-TXN-002: List transactions - Should return correct list", async ({ request }) => {
    const response = await request.get("/api/transactions", {
      headers: { "x-tenant-id": tenantA }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    // Recent transaction should be there
    expect(body.data.some((t: any) => t.description === "Starbucks Coffee")).toBe(true);
  });

  test("API-TXN-003: Filter transactions - Should filter by date correctly", async ({ request }) => {
    // Get current date
    const today = new Date().toISOString().split('T')[0];
    
    const response = await request.get(`/api/transactions?startDate=${today}`, {
      headers: { "x-tenant-id": tenantA }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // All returned transactions should be after or on today
    body.data.forEach((t: any) => {
      // String comparison works for ISO format
      expect(t.date >= today).toBe(true);
    });
  });

  test("API-TXN-004: Export CSV - Should download CSV correctly", async ({ request }) => {
    const response = await request.get("/api/transactions/export", {
      headers: { "x-tenant-id": tenantA }
    });
    
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("text/csv");
    expect(response.headers()["content-disposition"]).toContain("attachment");
    
    const body = await response.text();
    // Verify CSV structure
    const lines = body.split("\n");
    expect(lines[0]).toBe("ID,Date,Description,Amount,Category,Status");
    expect(lines.length).toBeGreaterThan(1);
  });

});
