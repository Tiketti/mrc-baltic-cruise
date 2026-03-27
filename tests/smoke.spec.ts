import { expect, test } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("should load the main page", async ({ page }) => {
    await page.goto("/baltic-cruise-2");

    await expect(page).toHaveTitle(/MRC Baltic Cruise/);

    // Cities should be visible as tab buttons (2026 order: Helsinki, Stockholm, Tallinn)
    const cities = ["Helsinki", "Stockholm", "Tallinn"];

    for (const city of cities) {
      await expect(page.getByRole("tab", { name: city })).toBeVisible();
    }
  });

  test("should have working FAQ section", async ({ page }) => {
    await page.goto("/baltic-cruise-2");

    const faqTitle = page.getByText("What is it?");

    await expect(faqTitle).toBeVisible();

    await faqTitle.click();

    await expect(
      page.getByText(/It's three cities in three days/),
    ).toBeVisible();
  });

  test("should show and close city agenda dialog", async ({ page }) => {
    await page.goto("/baltic-cruise-2");

    // Click "View Agenda" for Stockholm
    const stockholmCard = page
      .getByRole("heading", { name: "Stockholm" })
      .locator("..");
    await stockholmCard.getByRole("button", { name: "View Agenda" }).click();

    const dialog = page.getByRole("dialog");

    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "STOCKHOLM" }),
    ).toBeVisible();
    await expect(dialog.getByText(/11:55 Welcome and bag drop/)).toBeVisible();

    // 11.4.2026 is a Saturday
    await expect(dialog.getByText(/Saturday, April 11th/)).toBeVisible();

    await dialog.getByRole("button", { name: "Close" }).click();

    await expect(dialog).not.toBeVisible();
  });

  test("should switch between host sections", async ({ page }) => {
    await page.goto("/baltic-cruise-2");

    // Default tab is Helsinki in 2026
    await expect(
      page.getByRole("heading", { name: "MRC Helsinki" }),
    ).toBeVisible();
    await expect(
      page.getByText(/You don't have to be a runner to join us/),
    ).toBeVisible();

    // Switch to Stockholm
    await page.getByRole("tab", { name: "Stockholm" }).click();
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

    // Switch back to Helsinki
    await page.getByRole("tab", { name: "Helsinki" }).click();
    await expect(
      page.getByRole("heading", { name: "MRC Helsinki" }),
    ).toBeVisible();
    await expect(
      page.getByText(/You don't have to be a runner to join us/),
    ).toBeVisible();
  });
});
