import { test, expect } from "@playwright/test";

test.describe("API-EXTENDED: Extended Services API Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  test("API-NOT-001: Manage Notifications", async ({ request }) => {
    // 1. Create
    const createRes = await request.post("/api/notifications", {
      headers: { "x-tenant-id": tenantA },
      data: {
        userId: `${tenantA}-user`,
        message: "Your statement is ready",
        channel: "email",
        status: "active"
      }
    });
    expect(createRes.status()).toBe(201);
    const notification = (await createRes.json()).data;
    expect(notification.message).toBe("Your statement is ready");

    // 2. List
    const listRes = await request.get("/api/notifications", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(listRes.status()).toBe(200);
    expect((await listRes.json()).data.length).toBeGreaterThan(0);
  });

  test("API-INS-001: Get Financial Insights", async ({ request }) => {
    const response = await request.get("/api/insights", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const data = (await response.json()).data;
    expect(data).toHaveProperty("healthScore");
    expect(data).toHaveProperty("insights");
  });

  test("API-OPN-001: Open Banking Connections", async ({ request }) => {
    const response = await request.get("/api/open", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const data = (await response.json()).data;
    expect(Array.isArray(data)).toBe(true);
  });

  test("API-FRD-001: List Fraud Events", async ({ request }) => {
    const response = await request.get("/api/fraud", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const data = (await response.json()).data;
    expect(Array.isArray(data)).toBe(true);
  });

  test("API-DEV-001: Manage Trusted Devices", async ({ request }) => {
    const response = await request.get("/api/devices", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const data = (await response.json()).data;
    expect(Array.isArray(data)).toBe(true);
  });

  test("API-WHK-001: Webhook Events", async ({ request }) => {
    const response = await request.get("/api/webhooks", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const data = (await response.json()).data;
    expect(Array.isArray(data)).toBe(true);
  });

});
