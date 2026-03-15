import { test, expect } from "@playwright/test";

test.describe("API-SYSTEM-OPS: System Operations API Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  test("API-COM-001: List Compliance Records", async ({ request }) => {
    const response = await request.get("/api/compliance", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const data = (await response.json()).data;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test("API-LOC-001: List Locations", async ({ request }) => {
    const response = await request.get("/api/locations", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const data = (await response.json()).data;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test("API-ADM-001: Manage Admin Metrics", async ({ request }) => {
    // 1. Create
    const createRes = await request.post("/api/admin", {
      headers: { "x-tenant-id": tenantA },
      data: {
        category: "engagement",
        label: "DAU",
        value: 1500
      }
    });
    expect(createRes.status()).toBe(201);
    
    // 2. List
    const listRes = await request.get("/api/admin", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(listRes.status()).toBe(200);
    const metrics = (await listRes.json()).data;
    expect(metrics.some((m: any) => m.label === "DAU")).toBe(true);
  });

  test("API-SUP-001: Create Support Ticket", async ({ request }) => {
    // Get a user first
    const usersRes = await request.get("/api/accounts", { // Reuse accounts or listUsers if available
      headers: { "x-tenant-id": tenantA }
    });
    // Fallback if accounts doesn't return full user objects
    const userId = `${tenantA}-user`; 

    const response = await request.post("/api/support", {
      headers: { "x-tenant-id": tenantA },
      data: {
        userId,
        subject: "Test Ticket",
        message: "This is a test message",
        status: "open"
      }
    });
    expect(response.status()).toBe(201);
    const ticket = (await response.json()).data;
    expect(ticket.subject).toBe("Test Ticket");
  });

});
