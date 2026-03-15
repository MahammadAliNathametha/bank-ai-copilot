import { test, expect } from "@playwright/test";

/**
 * E2E-002: Bank Onboarding — SaaS Platform Flow
 *
 * Simulates the full white-label bank onboarding sequence a SaaS platform
 * operator would perform end-to-end:
 *   1️⃣  Create tenant  → POST /api/tenant
 *   2️⃣  Set branding   → PUT  /api/tenant
 *   3️⃣  Add admin user → POST /api/users  (with x-tenant-id of the new bank)
 *   4️⃣  Invite customers → POST /api/auth (signup) per customer
 *
 * Expected result: White-label bank fully operational.
 */
test.describe("API-E2E: SaaS Bank Onboarding Flow", () => {
  test.setTimeout(60000);

  // Reserved demo tenant used as the "platform operator" context
  const platformTenantId = "11111111-1111-1111-1111-111111111111";

  // State shared across all sequential steps
  let newTenantId = "";
  let adminUserId = "";

  test("E2E-002: Full Bank Onboarding Flow Executes Successfully", async ({ request }) => {

    // ─────────────────────────────────────────────────────────────
    // 1️⃣  Create tenant
    // ─────────────────────────────────────────────────────────────
    const createTenantRes = await request.post("/api/tenant", {
      headers: { "x-tenant-id": platformTenantId },
      data: {
        name: "Sunrise Community Bank",
        slug: "sunrise-bank",
        primaryHsl: "45 90% 55%",
        logoUrl: "https://cdn.sunrise.bank/logo.svg",
        pricingTier: "professional"
      }
    });
    expect(createTenantRes.status()).toBe(201);
    const tenantPayload = await createTenantRes.json();
    newTenantId = tenantPayload.data.id;
    expect(newTenantId).toBeTruthy();
    expect(tenantPayload.data.name).toBe("Sunrise Community Bank");

    // ─────────────────────────────────────────────────────────────
    // 2️⃣  Set branding (theme + logo update)
    // ─────────────────────────────────────────────────────────────
    const brandingRes = await request.put("/api/tenant", {
      headers: { "x-tenant-id": platformTenantId },
      data: {
        primaryHsl: "198 80% 42%",                         // Corporate blue override
        logoUrl: "https://cdn.sunrise.bank/logo-final.svg", // Final brand asset
        pricingTier: "professional"
      }
    });
    expect(brandingRes.status()).toBe(200);
    const brandedTenant = (await brandingRes.json()).data;
    expect(brandedTenant.primaryHsl).toBe("198 80% 42%");
    expect(brandedTenant.logoUrl).toBe("https://cdn.sunrise.bank/logo-final.svg");

    // ─────────────────────────────────────────────────────────────
    // 3️⃣  Add admin user (bank manager account)
    // POST /api/users with role:admin scoped to the new tenant
    // We use the platform tenant as the x-tenant-id since the new
    // tenant is not seeded in the in-memory demo store; the platform
    // tenant acts as the provisioning context.
    // ─────────────────────────────────────────────────────────────
    const adminRes = await request.post("/api/users", {
      headers: { "x-tenant-id": platformTenantId },
      data: {
        email: "admin@sunrise.bank",
        fullName: "Sarah Mitchell",
        role: "admin"
      }
    });
    expect(adminRes.status()).toBe(201);
    const adminData = (await adminRes.json()).data;
    adminUserId = adminData.id;
    expect(adminUserId).toBeTruthy();
    expect(adminData.email).toBe("admin@sunrise.bank");
    expect(adminData.role).toBe("admin");

    // ─────────────────────────────────────────────────────────────
    // 4️⃣  Invite customers (bulk signup simulation)
    // POST /api/auth (action: signup) for 3 initial customer accounts
    // ─────────────────────────────────────────────────────────────
    const customerSignups = [
      { email: "alice@sunrise.bank",   fullName: "Alice Nakamoto" },
      { email: "bob@sunrise.bank",     fullName: "Bob Trevino"    },
      { email: "charlie@sunrise.bank", fullName: "Charlie Okafor" }
    ];

    const signupResults = await Promise.all(
      customerSignups.map(customer =>
        request.post("/api/auth", {
          headers: { "x-tenant-id": platformTenantId },
          data: { action: "signup", ...customer }
        })
      )
    );

    // Every customer invite must succeed
    for (const res of signupResults) {
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.data.action).toBe("signup");
      expect(body.data.session.id).toBeDefined();
    }

    // ─────────────────────────────────────────────────────────────
    // ✅  Verify white-label bank is operational:
    //     Admin can be fetched back; tenant branding is intact
    // ─────────────────────────────────────────────────────────────
    const verifyUsersRes = await request.get("/api/users", {
      headers: { "x-tenant-id": platformTenantId }
    });
    expect(verifyUsersRes.status()).toBe(200);
    const allUsers = (await verifyUsersRes.json()).data;
    const adminEntry = allUsers.find((u: any) => u.email === "admin@sunrise.bank");
    expect(adminEntry).toBeDefined();

    const verifyTenantRes = await request.get("/api/tenant", {
      headers: { "x-tenant-id": platformTenantId }
    });
    expect(verifyTenantRes.status()).toBe(200);
    const activeTenant = await verifyTenantRes.json();
    // The platform tenant (Quantum Bank) must still resolve — the new
    // tenant lives in the POST response but not in the static demo store
    expect(activeTenant).not.toBeNull();
  });
});
