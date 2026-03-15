import { test, expect } from "@playwright/test";

test.describe("API-SEC: Security Feature Verification", () => {
  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank
  const tenantB = "22222222-2222-2222-2222-222222222222"; // Gujarat CU

  test("SEC-001: SQL injection attempts are blocked or neutralized", async ({ request }) => {
    // Attempt SQL injection payload in ID parameter
    const response = await request.get(`/api/accounts?id=1 OR 1=1--`, {
      headers: { "x-tenant-id": tenantA }
    });
    
    // The application should reject this as a bad request (400) entirely or NaN coercion -> 404
    expect([400, 404]).toContain(response.status());
  });

  test("SEC-002: Cross tenant access is denied", async ({ request }) => {
    // 1. Create a new, unique account natively belonging to Tenant A so it doesn't overlap with demo IDs
    const accountsRes = await request.post("/api/accounts", {
      headers: { "x-tenant-id": tenantA },
      data: { name: "Tenant A Top Secret", type: "checking" }
    });
    const newAccount = (await accountsRes.json()).data;
    const accountId = newAccount.id;

    // 2. Intentionally try to exploit and read that account using Tenant B headers
    const crossRes = await request.get(`/api/accounts?id=${accountId}`, {
      headers: { "x-tenant-id": tenantB }
    });
    
    // Multi-tenant abstraction should render it invisible/404 Not Found to Tenant B
    expect(crossRes.status()).toBe(404);
  });

  test("SEC-003: JWT tampering / invalid sessions are unauthorized", async ({ request }) => {
    // Simulate a cryptographically manipulated or invalid JWT token string
    const tamperedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature";
    
    // Auth validation endpoint
    const response = await request.get(`/api/auth?sessionId=${tamperedToken}`, {
      headers: { "x-tenant-id": tenantA }
    });
    
    // Our strict session resolution should kick back a 404 (Not Found / Expired) or 401
    expect([401, 404]).toContain(response.status());
  });

  test("SEC-004: Invalid input produces Zod validation error", async ({ request }) => {
    // Attempt to bypass validation or inject malicious type structures
    const response = await request.post("/api/accounts", {
      headers: { "x-tenant-id": tenantA },
      data: {
        userId: 12345, // Invalid mapping: Should be string UUID natively
        // Missing "name" entirely
        type: "imaginary-type", // Invalid strict enum
        balance: "not-a-number" // Invalid type
      }
    });

    // Zod must intercept malformed/missing data strictly and return a 400
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
    // Changed "Validation failure" to "Validation failed" to reflect the actual response string
    expect(body.error).toContain("Validation failed");
    expect(body).toHaveProperty("details");
  });

});
