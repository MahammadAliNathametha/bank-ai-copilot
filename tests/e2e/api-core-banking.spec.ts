import { test, expect } from "@playwright/test";

test.describe("API-CORE-BANKING: Core Banking API Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  test.describe("Beneficiaries API", () => {
    test("API-BEN-001: Create and List Beneficiaries", async ({ request }) => {
      // 1. Create
      const createRes = await request.post("/api/beneficiaries", {
        headers: { "x-tenant-id": tenantA },
        data: {
          name: "Satoshi Nakamoto",
          accountNumber: "99887766",
          routingNumber: "123456789",
          type: "individual"
        }
      });
      expect(createRes.status()).toBe(201);
      const ben = (await createRes.json()).data;
      expect(ben.name).toBe("Satoshi Nakamoto");

      // 2. List
      const listRes = await request.get("/api/beneficiaries", {
        headers: { "x-tenant-id": tenantA }
      });
      expect(listRes.status()).toBe(200);
      const list = (await listRes.json()).data;
      expect(list.some((b: any) => b.id === ben.id)).toBe(true);
    });
  });

  test.describe("Cards API", () => {
    test("API-CRD-001: List and Manage Cards", async ({ request }) => {
      // 1. List
      const listRes = await request.get("/api/cards", {
        headers: { "x-tenant-id": tenantA }
      });
      expect(listRes.status()).toBe(200);
      const cards = (await listRes.json()).data;
      expect(Array.isArray(cards)).toBe(true);

      // Note: POST /api/cards might not be fully functional for creation without user session
      // but let's assume it works with tenant header for now if implemented
    });
  });

  test.describe("Loans API", () => {
    test("API-LON-001: List and Detail Loans", async ({ request }) => {
      // 1. List
      const listRes = await request.get("/api/loans", {
        headers: { "x-tenant-id": tenantA }
      });
      expect(listRes.status()).toBe(200);
      const loans = (await listRes.json()).data;
      expect(loans.length).toBeGreaterThan(0);

      const loanId = loans[0].id;

      // 2. Detail
      const detailRes = await request.get(`/api/loans?id=${loanId}`, {
        headers: { "x-tenant-id": tenantA }
      });
      expect(detailRes.status()).toBe(200);
      expect((await detailRes.json()).data.id).toBe(loanId);
    });

    test("API-LOAN-002: Pay loan - Payment should reduce balance", async ({ request }) => {
      // 1. Get initial loan
      const listRes = await request.get("/api/loans", {
        headers: { "x-tenant-id": tenantA }
      });
      const loan = (await listRes.json()).data[0];
      const initialBalance = loan.balance;
      const payAmount = 100;

      // 2. Pay loan
      const payRes = await request.post(`/api/loans?action=pay`, {
        headers: { "x-tenant-id": tenantA },
        data: {
          id: loan.id,
          amount: payAmount
        }
      });
      expect(payRes.status()).toBe(200);
      const updatedLoan = (await payRes.json()).data;
      
      // 3. Verify balance reduced
      expect(updatedLoan.balance).toBeCloseTo(initialBalance - payAmount, 2);
    });
  });

});
