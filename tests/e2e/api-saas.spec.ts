import { test, expect } from "@playwright/test";

test.describe("API-SAAS: White-Label SaaS Feature Verification", () => {

  const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum Bank

  test("SAAS-001: Tenant creation - Create bank generates new tenant securely", async ({ request }) => {
    const response = await request.post("/api/tenant", {
      headers: { "x-tenant-id": tenantA },
      data: {
        name: "Acme Digital Bank",
        slug: "acme-db",
        primaryHsl: "120 100% 50%",
        logoUrl: "https://acme.org/logo.png"
      }
    });

    expect(response.status()).toBe(201);
    const tenantNode = (await response.json()).data;
    expect(tenantNode.name).toBe("Acme Digital Bank");
    expect(tenantNode.id).toBeDefined();
  });

  test("SAAS-002: Theme change - Change color updates primaryHsl correctly", async ({ request }) => {
    // Calling PUT assuming it acts dynamically against current header tenant mapping
    const putRes = await request.put("/api/tenant", {
      headers: { "x-tenant-id": tenantA },
      data: {
        primaryHsl: "240 100% 50%" // Updated theme color
      }
    });
    
    expect(putRes.status()).toBe(200);
    const tenantMeta = (await putRes.json()).data;
    expect(tenantMeta.primaryHsl).toBe("240 100% 50%");
  });

  test("SAAS-003: Logo change - Upload logo persists URL in active tenant data", async ({ request }) => {
    const response = await request.put("/api/tenant", {
      headers: { "x-tenant-id": tenantA },
      data: {
        logoUrl: "https://newbank.com/assets/brand.svg"
      }
    });

    expect(response.status()).toBe(200);
    const tenantMeta = (await response.json()).data;
    expect(tenantMeta.logoUrl).toBe("https://newbank.com/assets/brand.svg");
  });

  test("SAAS-004: Domain routing - Accessing via custom host routes to correct mapped tenant definition", async ({ request }) => {
    // In e2e playwright Request tests we simulate domain intercepts by injecting fake host headers
    // Test the GET API resolution which uses Request hostname parsing (should fallback to default if not mock setup, but test host parsing validation natively)
    const interceptReq = await request.get("/api/tenant", {
      headers: {
        "host": "quantum-bank.localhost:3000" // the parser reads .localhost domains
      }
    });

    expect(interceptReq.status()).toBe(200);
    const tenantResolution = await interceptReq.json();
    // quantum-bank returns the Quantum tenant match from hardcoded demo stores
    expect(tenantResolution.name).toBe("Quantum Bank");
    expect(tenantResolution.slug).toBe("quantum-bank");
  });

  test("SAAS-005: Pricing tier - Assigning platform tiers stores correct properties", async ({ request }) => {
    const response = await request.put("/api/tenant", {
      headers: { "x-tenant-id": tenantA },
      data: {
        pricingTier: "enterprise-scale"
      }
    });

    expect(response.status()).toBe(200);
    const tenantMeta = (await response.json()).data;
    expect(tenantMeta.pricingTier).toBe("enterprise-scale");
  });

  test("SAAS-006: Admin metrics - Validating multi-tenant behavioral analytics loading properly", async ({ request }) => {
    // Re-verify that analytics endpoints for administration successfully query data
    const response = await request.get("/api/admin", {
      headers: { "x-tenant-id": tenantA }
    });

    expect(response.status()).toBe(200);
    const multiTenantMetrics = (await response.json()).data;
    expect(Array.isArray(multiTenantMetrics)).toBe(true);
  });

});
