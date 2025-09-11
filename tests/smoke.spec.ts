import { expect, test } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("should load the main page", async ({ page }) => {
    await page.goto("/baltic-cruise");

    // Check if the page has loaded
    await expect(page).toHaveTitle(/MRC Baltic Cruise/);

    // Check if cities are visible in the tab buttons
    const cities = ["Stockholm", "Tallinn", "Helsinki"];

    for (const city of cities) {
      await expect(page.getByRole("tab", { name: city })).toBeVisible();
    }
  });

  test("should have working FAQ section", async ({ page }) => {
    await page.goto("/baltic-cruise");

    // Check if FAQ section exists and has content
    const faqTitle = page.getByText("What is it?");

    await expect(faqTitle).toBeVisible();

    // Click the FAQ item and check if content is visible
    await faqTitle.click();

    await expect(
      page.getByText(/It's three cities in three days/),
    ).toBeVisible();
  });

  test("should show and close city agenda dialog", async ({ page }) => {
    await page.goto("/baltic-cruise");

    // Click "View Agenda" for Stockholm
    const stockholmCard = page
      .getByRole("heading", { name: "Stockholm" })
      .locator("..");
    await stockholmCard.getByRole("button", { name: "View Agenda" }).click();

    // Check if dialog is visible with correct content
    const dialog = page.getByRole("dialog");

    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "STOCKHOLM" }),
    ).toBeVisible();
    await expect(dialog.getByText(/11:50 bag drop open/)).toBeVisible();

    // Check if date is formatted correctly
    await expect(dialog.getByText(/Friday, April 18th/)).toBeVisible();

    // Close dialog
    await dialog.getByRole("button", { name: "Close" }).click();

    // Check if dialog is closed
    await expect(dialog).not.toBeVisible();
  });

  test("should switch between host sections", async ({ page }) => {
    await page.goto("/baltic-cruise");

    // Check initial state (Stockholm)
    await expect(
      page.getByRole("heading", { name: "MRC Stockholm" }),
    ).toBeVisible();
    await expect(
      page.getByText(/The first attempt to start MRC Stockholm/),
    ).toBeVisible();

    // Switch to Tallinn
    await page.getByRole("tab", { name: "Tallinn" }).click();
    await expect(
      page.getByRole("heading", { name: "Pühaste Jooksuklubi" }),
    ).toBeVisible();
    await expect(
      page.getByText(/Our Club is a Phenomenon of Its Own/),
    ).toBeVisible();

    // Switch to Helsinki
    await page.getByRole("tab", { name: "Helsinki" }).click();
    await expect(
      page.getByRole("heading", { name: "MRC Helsinki" }),
    ).toBeVisible();
    await expect(
      page.getByText(/You don't have to be a runner to join us/),
    ).toBeVisible();

    // Switch back to Stockholm
    await page.getByRole("tab", { name: "Stockholm" }).click();
    await expect(
      page.getByRole("heading", { name: "MRC Stockholm" }),
    ).toBeVisible();
    await expect(
      page.getByText(/The first attempt to start MRC Stockholm/),
    ).toBeVisible();
  });
});
