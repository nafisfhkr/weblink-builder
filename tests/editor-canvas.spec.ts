import { test, expect } from "@playwright/test";

test.describe("Editor Canvas & Sidebar Smoke Tests", () => {
  test("should add Heading and Link blocks and update them", async ({ page }) => {
    // Visit dashboard
    await page.goto("/dashboard");

    // Create a new project
    const blankPageCard = page.locator("button:has-text('Blank Page')");
    await blankPageCard.click();

    // Wait for the editor to load
    await page.waitForURL("**/editor/*");
    
    // Check toolbar is visible
    const addButton = page.locator("#toolbar-add-block");
    await expect(addButton).toBeVisible();

    // 1. Add Heading block
    await addButton.click();
    const addHeadingOption = page.locator("button:has-text('Heading')");
    await expect(addHeadingOption).toBeVisible();
    await addHeadingOption.click();

    // When added, the block should get added to the canvas and sidebar should open automatically
    // Site Title input in the sidebar should be visible
    const headingTitleInput = page.locator("#sidebar-heading-title");
    await expect(headingTitleInput).toBeVisible();

    // Type new title in the sidebar
    await headingTitleInput.fill("Nafis Fakhru Halaman");
    
    // Check if the canvas updates in real-time
    const headingOnCanvas = page.locator("h1", { hasText: "Nafis Fakhru Halaman" });
    await expect(headingOnCanvas).toBeVisible();

    // Fill bio
    const bioTextarea = page.locator("#sidebar-heading-bio");
    await bioTextarea.fill("Full Stack Engineer from Semarang.");
    const bioOnCanvas = page.locator("p", { hasText: "Full Stack Engineer from Semarang." });
    await expect(bioOnCanvas).toBeVisible();

    // 2. Add Link block
    await addButton.click();
    const addLinkOption = page.locator("button:has-text('Link')");
    await expect(addLinkOption).toBeVisible();
    await addLinkOption.click();

    // Check if the Link panel is loaded in the sidebar
    const linkTitleInput = page.locator("#sidebar-link-title");
    await expect(linkTitleInput).toBeVisible();
    
    await linkTitleInput.fill("Website Portofolio");
    const linkUrlInput = page.locator("#sidebar-link-url");
    await linkUrlInput.fill("https://nafisfakhru.xyz");

    // Wait for auto-save text
    await page.waitForTimeout(2000); // Allow server PATCH request to finish
    await expect(page.locator("text=Tersimpan")).toBeVisible();
  });
});
