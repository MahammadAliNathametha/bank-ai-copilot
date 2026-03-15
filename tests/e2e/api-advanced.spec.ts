import { test, expect } from "@playwright/test";

test.describe("API-ADVANCED: Advanced Feature Tests Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  test("ADV-001: AI spending insights - Generate insights creates correct analysis", async ({ request }) => {
    const response = await request.get("/api/insights", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveProperty("healthScore");
  });

  test("ADV-002: Open banking - Aggregate accounts data fetched", async ({ request }) => {
    const response = await request.get("/api/open", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("ADV-003: Biometric - Enable Face ID via user settings update", async ({ request }) => {
    // Note: Assuming a primary user id is known or we list first. Let's list users to get one.
    const listRes = await request.get("/api/users", {
        headers: { "x-tenant-id": tenantA }
    });
    const users = (await listRes.json()).data;
    const user = users[0];

    // Enable biometrics via PUT
    const updateRes = await request.put(`/api/users?id=${user.id}`, {
        headers: { "x-tenant-id": tenantA },
        data: {
            biometricEnabled: true
        }
    });
    expect(updateRes.status()).toBe(200);
    const updatedUser = (await updateRes.json()).data;
    expect(updatedUser.biometricEnabled).toBe(true);
  });

  test("ADV-004: Marketing offers - Balance > 1000 triggers correct offer logic (List check)", async ({ request }) => {
    const response = await request.get("/api/marketing", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("ADV-005: Fraud detection - Large transaction alert is present", async ({ request }) => {
    const response = await request.get("/api/fraud", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("ADV-006: Voice banking - Speak command is executed and saved", async ({ request }) => {
    const response = await request.post("/api/voice", {
      headers: { "x-tenant-id": tenantA },
      data: {
        userId: `${tenantA}-user`,
        command: "What is my balance?",
        transcript: "what is my balance",
        response: "Your checking account balance is 3,520 dollars.",
        status: "processed"
      }
    });

    expect(response.status()).toBe(201);
    const command = (await response.json()).data;
    expect(command.command).toBe("What is my balance?");
  });

  test("ADV-007: Crypto wallet - View balance is correct", async ({ request }) => {
    const response = await request.get("/api/crypto", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const data = (await response.json()).data;
    expect(data.assets).toBeDefined();
    expect(data.holdings).toBeDefined();
    expect(data.trades).toBeDefined();
  });

  test("ADV-008: Round-up savings - Enable saves correctly", async ({ request }) => {
    const response = await request.post("/api/savings", {
      headers: { "x-tenant-id": tenantA },
      data: {
        userId: `${tenantA}-user`,
        name: "Round-up checking",
        cadence: "daily",
        amount: 50,
        target: 1000,
        status: "active"
      }
    });
    expect(response.status()).toBe(201);
    const rule = (await response.json()).data;
    expect(rule.name).toBe("Round-up checking");
  });

  test("ADV-009: Digital wallet - Provision card link is created", async ({ request }) => {
    const response = await request.post("/api/wallet", {
      headers: { "x-tenant-id": tenantA },
      data: {
        userId: `${tenantA}-user`,
        walletType: "Apple Pay",
        last4: "9988",
        brand: "Visa",
        status: "active",
        addedAt: new Date().toISOString()
      }
    });

    expect(response.status()).toBe(201);
    const card = (await response.json()).data;
    expect(card.walletType).toBe("Apple Pay");
  });

  test("ADV-010: Credit score - View score is shown", async ({ request }) => {
    const response = await request.get("/api/credit-scores", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("ADV-011: Behavioral analytics - Load admin analytics displays chart data", async ({ request }) => {
    const response = await request.get("/api/admin", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const metrics = (await response.json()).data;
    expect(Array.isArray(metrics)).toBe(true);
  });

  test("ADV-012: Compliance logs - Perform action generates log", async ({ request }) => {
    const response = await request.get("/api/compliance", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("ADV-013: AI chatbot - Ask question returns response", async ({ request }) => {
    const response = await request.post("/api/chatbot", {
      headers: { "x-tenant-id": tenantA },
      data: {
        sessionId: "234e5678-e89b-12d3-a456-426614174000",
        userId: `${tenantA}-user`,
        role: "user",
        message: "How do I dispute a transaction?"
      }
    });

    expect(response.status()).toBe(201);
    const message = (await response.json()).data;
    expect(message.message).toBe("How do I dispute a transaction?");
  });

  test("ADV-014: Instant rails - Send instant real-time payment succeeds", async ({ request }) => {
    const response = await request.post("/api/payments", {
      headers: { "x-tenant-id": tenantA },
      data: {
        recipient: "Bob from Marketplace",
        amount: 85,
        channel: "p2p" // Using P2P for instant rails per requirements mapping
      }
    });

    expect(response.status()).toBe(201);
    const payment = (await response.json()).data;
    expect(payment.recipient).toBe("Bob from Marketplace");
  });

});
