import { defineConfig } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL,
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  },
  webServer: {
    command: 'pnpm start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  // Start app manually (pnpm dev) then run tests. If app runs on another port:
  //   BASE_URL=http://127.0.0.1:3001 pnpm test:e2e -- tests/e2e/blink.spec.ts
  // With trace + report to inspect blink: add --trace=on --video=on then npx playwright show-report
});
