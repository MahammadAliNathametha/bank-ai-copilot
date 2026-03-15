import { test, expect } from "@playwright/test";

test.describe("API-BILL-GROUP: Bills API Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  test("API-BILL-001: Create payee - Should add a new payee successfully", async ({ request }) => {
    const response = await request.post("/api/payees", {
      headers: { "x-tenant-id": tenantA },
      data: {
        name: "Cloud Hosting Corp",
        accountNumber: "987654321",
        routingNumber: "123456789"
      }
    });
    if (response.status() !== 201) {
      console.log('Error Body:', await response.json());
    }
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.name).toBe("Cloud Hosting Corp");
    expect(body.data).toHaveProperty("id");
  });

  test("API-BILL-002: Schedule bill - Should schedule a payment successfully", async ({ request }) => {
    // 1. Get/Create a payee first
    const payeeRes = await request.post("/api/payees", {
      headers: { "x-tenant-id": tenantA },
      data: {
        name: "Utility Services Inc",
        accountNumber: "11223344"
      }
    });
    const payee = (await payeeRes.json()).data;

    // 2. Schedule bill
    const response = await request.post("/api/bills", {
      headers: { "x-tenant-id": tenantA },
      data: {
        payeeId: payee.id,
        payeeName: payee.name,
        amount: 245.5,
        schedule: "Monthly",
        status: "scheduled"
      }
    });
    if (response.status() !== 201) {
      console.log('Bill Error Body:', await response.json());
    }
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.payeeId).toBe(payee.id);
    expect(body.data.amount).toBe(245.5);
    expect(body.data.schedule).toBe("Monthly");
  });

});
