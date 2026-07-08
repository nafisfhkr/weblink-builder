import { test, expect } from "@playwright/test";

test.describe("Auth & Dashboard Smoke Tests", () => {
  test("should load Landing Page and show dynamic login states", async ({ page }) => {
    // Visit landing page (not logged in normally, but PLAYWRIGHT_TEST is true, so auth() on the server will see us as logged in)
    await page.goto("/");
    
    // The server component landing page uses auth(). Since PLAYWRIGHT_TEST is true, it should see us as logged in
    // and render "Dashboard" instead of "Login"
    const dashboardButton = page.getByRole("link", { name: "Dashboard", exact: true });
    await expect(dashboardButton).toBeVisible();
    
    const heroDashboardButton = page.locator("a:has-text('Lanjut ke Dashboard')");
    await expect(heroDashboardButton).toBeVisible();
  });

  test("should render Dashboard and create a new project", async ({ page }) => {
    // Visit dashboard
    await page.goto("/dashboard");

    // Make sure we see the Dashboard header
    await expect(page.locator("h1:has-text('My Projects')")).toBeVisible();

    // Click Blank Page button
    const blankPageCard = page.locator("button:has-text('Blank Page')");
    await expect(blankPageCard).toBeVisible();
    await blankPageCard.click();

    // Expecting to be redirected to the editor page
    await page.waitForURL("**/editor/*");
    
    // Expect editor elements to load
    const toolbar = page.locator("#toolbar-add-block");
    await expect(toolbar).toBeVisible();
  });
});
