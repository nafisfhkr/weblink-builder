import { defineConfig, devices } from "@playwright/test";

// Set environment variable to bypass auth in our auth.ts file
process.env.PLAYWRIGHT_TEST = "true";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // Turn off parallel execution to prevent database write conflicts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid database locks
  reporter: "html",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
    video: "on",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npx next dev -p 3001",
    url: "http://localhost:3001",
    reuseExistingServer: false,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      PLAYWRIGHT_TEST: "true",
    },
  },
});
