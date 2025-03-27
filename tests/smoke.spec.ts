import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("should load the main page", async ({ page }) => {
    await page.goto("/");

    // Check if the page has loaded
    await expect(page).toHaveTitle(/MRC Baltic Cruise/);

    // Check if cities are visible in the tab buttons
    const cities = ["Stockholm", "Tallinn", "Helsinki"];

    for (const city of cities) {
      await expect(page.getByRole("tab", { name: city })).toBeVisible();
    }
  });

  test("should have working FAQ section", async ({ page }) => {
    await page.goto("/");

    // Check if FAQ section exists and has content
    const faqTitle = page.getByText("What is it?");

    await expect(faqTitle).toBeVisible();

    // Click the FAQ item and check if content is visible
    await faqTitle.click();

    await expect(
      page.getByText(/It's three cities in three days/),
    ).toBeVisible();
  });
});
