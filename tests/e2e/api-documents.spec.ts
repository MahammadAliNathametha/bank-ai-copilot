import { test, expect } from "@playwright/test";

test.describe("API-DOC-GROUP: Documents API Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  test("API-DOC-001: Upload document - Should upload a file successfully", async ({ request }) => {
    // 1. Upload using multipart/form-data
    const response = await request.post("/api/documents", {
      headers: { "x-tenant-id": tenantA },
      multipart: {
        userId: `${tenantA}-user`,
        type: "Checking Statement",
        status: "ready",
        file: {
          name: "march_statement.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("%PDF-1.4 ... mock pdf content ...")
        }
      }
    });

    if (response.status() !== 201) {
      console.log('Upload Error:', await response.json());
    }
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.data.type).toBe("Checking Statement");
    expect(body.data.url).toContain("march_statement.pdf");
  });

  test("API-DOC-002: Download statement - Should list documents and verify availability", async ({ request }) => {
    // 1. List
    const response = await request.get("/api/documents", {
      headers: { "x-tenant-id": tenantA }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    
    // Verify at least one document has a URL
    const doc = body.data[0];
    expect(doc).toHaveProperty("url");
    expect(doc.url).toBeTruthy();
  });

});
