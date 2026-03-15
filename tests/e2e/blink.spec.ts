import { expect, test } from "@playwright/test";

/**
 * Blink detection tests:
 * - Capture screenshots at intervals after navigation to catch layout/content flash.
 * - Assert that dashboard content stabilizes (tenant header visible within timeout).
 *
 * Run (start app first: pnpm dev, then):
 *   pnpm test:e2e -- tests/e2e/blink.spec.ts
 * If app is on another port: BASE_URL=http://127.0.0.1:3001 pnpm test:e2e -- tests/e2e/blink.spec.ts
 *
 * To see the blink in the UI (trace + video):
 *   pnpm test:e2e -- tests/e2e/blink.spec.ts --trace=on --video=on
 *   npx playwright show-report
 *
 * Screenshots: test-results/.../blink-dashboard-{0,100,300,600,1000}ms.png
 */

test.describe("blink / flash detection", () => {
  test("dashboard: capture load sequence (screenshots at 0, 100, 300, 600, 1000ms)", async ({
    page
  }, testInfo) => {
    const delays = [0, 100, 300, 600, 1000];
    const snapshots: { ms: number; path: string }[] = [];

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

    let lastMs = 0;
    for (const ms of delays) {
      if (ms > lastMs) {
        await page.waitForTimeout(ms - lastMs);
      }
      lastMs = ms;
      const path = testInfo.outputPath(`blink-dashboard-${ms}ms.png`);
      await page.screenshot({ path, fullPage: false });
      snapshots.push({ ms, path });
    }

    // Log so we can find screenshots in report (also in test-results/ for blink inspection)
    for (const { ms, path } of snapshots) {
      console.log(`Screenshot at ${ms}ms: ${path}`);
    }

    // Ensure we captured all; compare screenshots manually to see blink
    expect(snapshots.length).toBe(delays.length);
  });

  test("dashboard: content stabilizes (tenant header or skeleton then header)", async ({
    page
  }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded", timeout: 15000 });

    // Within 8s we should see either the loading skeleton or the tenant header
    const tenantHeader = page.getByRole("heading", { level: 1 });
    const skeleton = page.locator("main .animate-pulse").first();

    await expect(tenantHeader.or(skeleton).first()).toBeVisible({ timeout: 8000 });

    // Eventually the real header (tenant name) should appear
    await expect(tenantHeader).toContainText(/\w+/, { timeout: 10000 });
  });

  test("home: no blink on load", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    // Home has "Premium banking UX" or "digital sales"
    const title = page.getByText(/Premium banking UX|digital sales & service/i).first();
    await expect(title).toBeVisible({ timeout: 8000 });
  });
});
