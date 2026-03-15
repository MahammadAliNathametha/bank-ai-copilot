import { test, expect } from "@playwright/test";

test.describe("API-E2E: Full Customer Banking Flow Verification", () => {
  test.setTimeout(90000); // Full 8-step sequential flow needs extra time in local dev environment
  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank
  
  // Shared state across the sequential E2E flow
  let authSessionId = "";
  let accountId: number;
  let documentUrl: string;

  test("E2E-001: Customer Banking Flow Executed Successfully in Sequence", async ({ request }) => {
    
    // 1️⃣ Signup
    const signupRes = await request.post("/api/auth", {
      headers: { "x-tenant-id": tenantA },
      data: {
        action: "signup",
        email: "e2e-customer@example.com",
        fullName: "E2E Test User"
      }
    });
    expect(signupRes.status()).toBe(201);
    const signupData = await signupRes.json();
    expect(signupData.data.action).toBe("signup");

    // 2️⃣ Login
    const loginRes = await request.post("/api/auth", {
      headers: { "x-tenant-id": tenantA },
      data: {
        action: "login",
        email: "e2e-customer@example.com"
      }
    });
    expect(loginRes.status()).toBe(201);
    const loginData = await loginRes.json();
    authSessionId = loginData.data.session.id;
    expect(authSessionId).toBeDefined();

    // 3️⃣ Open account
    const accRes = await request.post("/api/accounts", {
      headers: { "x-tenant-id": tenantA },
      data: {
        name: "E2E High Yield Savings",
        type: "savings",
        balance: 0
      }
    });
    expect(accRes.status()).toBe(201);
    const accData = await accRes.json();
    accountId = accData.data.id;
    expect(accountId).toBeDefined();

    // 4️⃣ Deposit money (transcribed as an income transaction - represents a wire/ACH deposit)
    const depositRes = await request.post("/api/transactions", {
      headers: { "x-tenant-id": tenantA },
      data: {
        accountId: accountId,
        amount: 5000,
        description: "Initial Deposit",
        category: "Income",
        status: "posted"
      }
    });
    expect(depositRes.status()).toBe(201);

    // Also update the account balance since mock transactions don't auto-trigger balance updates
    await request.put(`/api/accounts?id=${accountId}`, {
      headers: { "x-tenant-id": tenantA },
      data: { balance: 5000 }
    });

    // 5️⃣ Transfer funds (internal)
    // Create a destination account first to transfer to
    const targetAccRes = await request.post("/api/accounts", {
      headers: { "x-tenant-id": tenantA },
      data: { name: "E2E Checking", type: "checking", balance: 0 }
    });
    const targetAccountId = (await targetAccRes.json()).data.id;

    // transferSchema: { fromId, toId, amount, method }
    const transferRes = await request.post("/api/transfers", {
      headers: { "x-tenant-id": tenantA },
      data: {
        fromId: accountId,
        toId: targetAccountId,
        amount: 250,
        method: "internal"
      }
    });
    expect(transferRes.status()).toBe(201);

    // 6️⃣ Pay bill
    // billCreateSchema: { payeeId, payeeName, amount, schedule, status? }
    const billRes = await request.post("/api/bills", {
      headers: { "x-tenant-id": tenantA },
      data: {
        payeeId: 1,
        payeeName: "Electric Company",
        amount: 120,
        schedule: new Date().toISOString().split("T")[0]
      }
    });
    expect(billRes.status()).toBe(201);

    // 7️⃣ View transactions
    const txRes = await request.get("/api/transactions", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(txRes.status()).toBe(200);
    const txList = await txRes.json();
    expect(txList.data.length).toBeGreaterThan(0);

    // 8️⃣ Download statement
    // Upload a statement document via multipart (Playwright native API)
    const docUploadRes = await request.post("/api/documents", {
      headers: { "x-tenant-id": tenantA },
      multipart: {
        userId: `${tenantA}-user`,
        type: "Savings Statement",
        status: "ready",
        file: {
          name: "e2e-statement.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("%PDF-1.4 E2E mock statement content")
        }
      }
    });
    expect(docUploadRes.status()).toBe(201);

    // Now we "download" or list the document and ensure it exists and returns a URL
    const docListRes = await request.get("/api/documents", {
      headers: { "x-tenant-id": tenantA }
    });
    expect(docListRes.status()).toBe(200);
    const docs = await docListRes.json();
    // DocumentRecord has no 'name' field; match by 'type' set during upload
    const uploadedDoc = docs.data.find((d: any) => d.type === "Savings Statement");
    expect(uploadedDoc).toBeDefined();
    expect(uploadedDoc.url).toBeDefined(); // URL provided by the storage layer (mock or live)
    expect(uploadedDoc.url).toContain("e2e-statement.pdf");
  });
});
