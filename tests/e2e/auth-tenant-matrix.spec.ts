import { test, expect } from "@playwright/test";

test.describe("AUTH-TENANT-MATRIX: Authentication & Tenant Verification", () => {
  
  test("AUTH-001: User signup creates profile in profiles", async ({ page }) => {
    const signupEmail = `test${Date.now()}@test.com`;
    await page.goto("/signup");
    
    // Clear and fill to be absolutely sure
    const nameInput = page.getByPlaceholder(/full name/i);
    await nameInput.clear();
    await nameInput.fill("Test Matrix User");
    
    const emailInput = page.getByPlaceholder(/work email/i);
    await emailInput.clear();
    await emailInput.fill(signupEmail);
    
    await page.getByRole("button", { name: /initialize account/i }).click();
    
    // Check for success message with regex to be flexible with wrapping
    await expect(page.locator("text=Success!")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("body")).toContainText(signupEmail);
  });

  test("AUTH-002: Tenant auto assignment via subdomain", async ({ page }) => {
    // We navigate to a subdomain URL. 
    // Note: We use .localhost which usually resolves to 127.0.0.1 on most modern OSs.
    await page.goto("http://quantum-bank.localhost:3000/api/accounts");
    
    // The response should be the JSON data
    const pre = page.locator("pre");
    const content = await pre.textContent();
    const body = JSON.parse(content || "{}");
    
    expect(body.tenantId).toBe("11111111-1111-1111-1111-111111111111");
  });

  test("AUTH-003: Login success with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/email address/i).fill("demo@tenant.test");
    await page.getByPlaceholder(/password/i).fill("password123");
    
    await Promise.all([
      page.waitForURL(/\/dashboard/, { timeout: 20000 }),
      page.getByRole("button", { name: /sign in to console/i }).click()
    ]);
    
    await expect(page.locator("h1")).toBeVisible();
  });

  test("AUTH-004: Login failure with invalid email", async ({ page }) => {
    await page.goto("/login");
    // Test Zod validation on the client side
    await page.getByPlaceholder(/email address/i).fill("not-an-email");
    await page.getByPlaceholder(/password/i).fill("p");
    await page.keyboard.press("Tab");
    
    await page.getByRole("button", { name: /sign in to console/i }).click();
    
    // Zod error message
    await expect(page.locator("text=Invalid email")).toBeVisible();
  });

  test("AUTH-005: Session validation (Access API with session)", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/email address/i).fill("demo@tenant.test");
    await page.getByPlaceholder(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in to console/i }).click();
    
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20000 });
    
    // Check for elements that require successful API data load
    await expect(page.locator("text=Savings").first()).toBeVisible();
  });

  test("AUTH-006: Unauthorized API (400 error on conflict)", async ({ request }) => {
    const response = await request.get("/api/accounts", {
      headers: {
        'Host': 'quantum-bank.localhost:3000',
        'x-tenant-id': '22222222-2222-2222-2222-222222222222' // Gujarat CU
      }
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    // Accept either error message as they both indicate blocked access
    expect(body.error).toMatch(/Invalid tenant context|Tenant context missing/);
  });

  test("AUTH-007: Tenant isolation login verification", async ({ request }) => {
    // Verify that x-tenant-id header correctly scopes the response
    const tenantA = "11111111-1111-1111-1111-111111111111"; // Quantum 
    const tenantB = "22222222-2222-2222-2222-222222222222"; // Gujarat CU
    
    const resA = await request.get("/api/accounts", { headers: { "x-tenant-id": tenantA } });
    const dataA = await resA.json();
    expect(dataA.tenantId).toBe(tenantA);
    
    const resB = await request.get("/api/accounts", { headers: { "x-tenant-id": tenantB } });
    const dataB = await resB.json();
    expect(dataB.tenantId).toBe(tenantB);
    
    expect(dataA.tenantId).not.toBe(dataB.tenantId);
  });

});
