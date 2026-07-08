import { test, expect } from "@playwright/test";

test.describe("Draft & Publish E2E Tests", () => {
  test("should separate draft changes from public view until published", async ({ page, context }) => {
    // 1. Visit dashboard and create a new project
    await page.goto("/dashboard");
    const blankPageCard = page.locator("button:has-text('Blank Page')");
    await blankPageCard.click();
    await page.waitForURL("**/editor/*");

    // Extract the slug from the header in the editor page
    const slugLocator = page.locator("header p.text-zinc-500");
    await expect(slugLocator).toBeVisible();
    const slugText = await slugLocator.innerText();
    const slug = slugText.replace("/", "").trim();
    expect(slug.length).toBeGreaterThan(0);

    // Add a Heading block and set its title
    const addButton = page.locator("#toolbar-add-block");
    await addButton.click();
    const addHeadingOption = page.locator("button:has-text('Heading')");
    await addHeadingOption.click();

    const headingTitleInput = page.locator("#sidebar-heading-title");
    await expect(headingTitleInput).toBeVisible();
    await headingTitleInput.fill("Draf Keren Saya");

    // Wait for the automatic saving to complete
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Tersimpan")).toBeVisible();

    // 2. Open public page in a new context/page
    const publicPage = await context.newPage();
    await publicPage.goto(`/${slug}`);

    // Since the project is newly created and not published yet, it should show the Unpublished state
    const unpublishedHeader = publicPage.locator("h1:has-text('Halaman Belum Dipublikasikan')");
    await expect(unpublishedHeader).toBeVisible();

    // 3. Go back to the editor page and Publish
    await page.bringToFront();
    const publishButton = page.locator("button:has-text('Publish')");
    await expect(publishButton).toBeVisible();
    await publishButton.click();

    // Wait for the success toast or state change to "Published"
    const publishedButton = page.locator("button:has-text('Published')");
    await expect(publishedButton).toBeVisible({ timeout: 5000 });

    // 4. Check the public page again
    await publicPage.bringToFront();
    await publicPage.reload();

    // Now it should display our published contents!
    const publicHeading = publicPage.locator("h1", { hasText: "Draf Keren Saya" });
    await expect(publicHeading).toBeVisible();

    // Verify background defaults or settings
    await expect(publicPage.locator("div.min-h-screen")).toBeVisible();
  });
});
