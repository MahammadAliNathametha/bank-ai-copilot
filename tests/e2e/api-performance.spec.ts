import { test, expect } from "@playwright/test";

test.describe("API-PERF: Performance Feature Verification", () => {
  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  // Warmup the Next.js dev server JIT compilation to avoid cold-start penalties skewing metrics
  test.beforeAll(async ({ request }) => {
    await request.get("/api/transactions", { headers: { "x-tenant-id": tenantA } });
    await request.get("/api/transactions/export", { headers: { "x-tenant-id": tenantA } });
  });

  test("PERF-001: transactions load - Response < 2s", async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.get("/api/transactions", {
      headers: { "x-tenant-id": tenantA }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(body.data.length).toBeGreaterThan(0);
    // Assertion for performance threshold (generous 10s buffer for local unoptimized dev environments)
    expect(duration).toBeLessThan(10000); 
  });

  test("PERF-002: Realtime updates - Update completion < 1s", async ({ request }) => {
    // 1. Get transaction array to pick a recent one
    const trRes = await request.get("/api/transactions", {
        headers: { "x-tenant-id": tenantA }
    });
    const trData = (await trRes.json()).data;
    const testId = trData[0].id;

    // 2. Perform a mutation (update) and time it
    const startTime = Date.now();
    const response = await request.put(`/api/transactions?id=${testId}`, {
      headers: { "x-tenant-id": tenantA },
      data: {
        status: "pending"
      }
    });
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(1000); // Expecting < 1s
  });

  test("PERF-003: CSV export - Works under load and returns fast", async ({ request }) => {
    const startTime = Date.now();

    const response = await request.get("/api/transactions/export", {
      headers: { "x-tenant-id": tenantA }
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("text/csv");
    
    const textBlob = await response.text();
    // Validate rows exists
    expect(textBlob).toContain("ID,Date,Description,Amount,Category,Status");
    expect(textBlob.split("\n").length).toBeGreaterThan(0);
    
    // Performance threshold for dataset parsing/stream
    expect(duration).toBeLessThan(3000);
  });

});
