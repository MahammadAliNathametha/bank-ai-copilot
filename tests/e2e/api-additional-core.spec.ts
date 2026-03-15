import { test, expect } from "@playwright/test";

test.describe("API-ADDITIONAL-CORE: Additional Core Feature Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  test("CORE-005: Check deposit - Upload check images returns credited account", async ({ request }) => {
    // 1. Need an account first
    const accountsRes = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    const accounts = (await accountsRes.json()).data;
    const account = accounts[0];

    // 2. Perform multipart form-data upload for check deposit
    const response = await request.post("/api/checkdeposit", {
      headers: { "x-tenant-id": tenantA },
      multipart: {
        accountId: String(account.id),
        amount: "500.50",
        file: {
          name: "check_front.jpg",
          mimeType: "image/jpeg",
          buffer: Buffer.from("fake image data") // mock payload
        }
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data).toHaveProperty("document");
    expect(body.data).toHaveProperty("transaction");
    expect(body.data.transaction.amount).toBe(500.5);
  });

  test("CORE-009: Support chat - Send message and start session", async ({ request }) => {
    const response = await request.post("/api/chatbot", {
      headers: { "x-tenant-id": tenantA },
      data: {
        sessionId: "123e4567-e89b-12d3-a456-426614174000",
        userId: `${tenantA}-user`,
        role: "user",
        message: "I need help with my account"
      }
    });

    expect(response.status()).toBe(201);
    const message = (await response.json()).data;
    expect(message.message).toBe("I need help with my account");
  });

  test("CORE-015 & CORE-017: P2P & Wire transfer - Manage outbound payments", async ({ request }) => {
    // P2P Payment
    const p2pRes = await request.post("/api/payments", {
      headers: { "x-tenant-id": tenantA },
      data: {
        recipient: "Alice Smith",
        amount: 50.00,
        channel: "p2p"
      }
    });
    expect(p2pRes.status()).toBe(201);
    expect((await p2pRes.json()).data.channel).toBe("p2p");

    // Wire Transfer
    const wireRes = await request.post("/api/payments", {
      headers: { "x-tenant-id": tenantA },
      data: {
        recipient: "Acme Corp",
        amount: 15000.00,
        channel: "wire"
      }
    });
    expect(wireRes.status()).toBe(201);
    expect((await wireRes.json()).data.channel).toBe("wire");
  });

  test("CORE-016: Budget - Create savings rule", async ({ request }) => {
    const response = await request.post("/api/savings", {
      headers: { "x-tenant-id": tenantA },
      data: {
        userId: `${tenantA}-user`,
        name: "Vacation Fund",
        cadence: "monthly",
        amount: 250,
        target: 5000,
        status: "active"
      }
    });

    expect(response.status()).toBe(201);
    const rule = (await response.json()).data;
    expect(rule.name).toBe("Vacation Fund");
  });

  test("CORE-019: Appointment - Schedule a meeting", async ({ request }) => {
    const response = await request.post("/api/appointments", {
      headers: { "x-tenant-id": tenantA },
      data: {
        userId: `${tenantA}-user`,
        locationName: "Downtown Branch",
        timeSlot: "2026-03-20T10:00:00Z",
        agenda: "Mortgage application",
        status: "requested"
      }
    });

    expect(response.status()).toBe(201);
    const appt = (await response.json()).data;
    expect(appt.agenda).toBe("Mortgage application");
  });

  test("CORE-020: Business users - Add role to account member", async ({ request }) => {
    // 1. Get account
    const accountsRes = await request.get("/api/accounts", {
      headers: { "x-tenant-id": tenantA }
    });
    const accountId = (await accountsRes.json()).data[0].id;

    // 2. Add member
    const response = await request.post("/api/account-members", {
      headers: { "x-tenant-id": tenantA },
      data: {
        accountId: accountId,
        userId: `${tenantA}-colleague`,
        role: "editor"
      }
    });

    expect(response.status()).toBe(201);
    const member = (await response.json()).data;
    expect(member.role).toBe("editor");
  });

  test("CORE-023: Investments - View history & accounts", async ({ request }) => {
    // 1. Create investment
    const createRes = await request.post("/api/investments", {
      headers: { "x-tenant-id": tenantA },
      data: {
        userId: `${tenantA}-user`,
        provider: "WealthFront",
        accountName: "Tech ETF",
        balance: 10500.00,
        type: "brokerage",
        status: "active"
      }
    });
    expect(createRes.status()).toBe(201);

    // 2. View
    const listRes = await request.get("/api/investments", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(listRes.status()).toBe(200);
    const list = (await listRes.json()).data;
    expect(list.length).toBeGreaterThan(0);
  });

});
