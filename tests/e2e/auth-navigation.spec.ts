import { test, expect } from "@playwright/test";

test.describe("Auth & Navigation UI", () => {
  test("complete login and logout cycle", async ({ page }) => {
    // 1. Visit landing page
    await page.goto("/");
    await expect(page).toHaveTitle(/White-label Digital Banking/i);
    await expect(page.getByRole("button", { name: /open demo console/i })).toBeVisible();

    // 2. Perform Login
    await page.getByRole("button", { name: /open demo console/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    
    // 3. Verify Sidebar and Scrollbar area
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();
    
    // Check if the scrollbar class is present
    const nav = sidebar.locator("nav");
    await expect(nav).toHaveClass(/scrollbar-thin/);

    // 4. Perform Logout
    // The logout button is in the bottom section of the sidebar
    const logoutBtn = sidebar.getByTitle("Logout");
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // 5. Verify Redirect to Landing Content
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: /open demo console/i })).toBeVisible();
  });

  test("sidebar scrollbar visual check", async ({ page }) => {
    await page.goto("/dashboard");
    // Trigger "Open demo console" bypass if needed, but pnpm start usually has a session or we can just go to /dashboard directly if the app allows it in demo mode.
    // However, let's be safe and login.
    await page.goto("/");
    await page.getByRole("button", { name: /open demo console/i }).click();
    
    const sidebar = page.locator("aside");
    const nav = sidebar.locator("nav");
    
    // Scroll to see if scrollbar appears and is consistent
    await nav.evaluate(el => el.scrollTop = 100);
    
    // Take screenshot of sidebar to verify the orange scrollbar
    await sidebar.screenshot({ path: "test-results/sidebar-scrollbar-highres.png" });
  });
});
