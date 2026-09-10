import { type Page, expect, test } from "@playwright/test";

/**
 * Asserts every nav tab sits within the nav's own bounds, i.e. the row isn't
 * overflowing into a horizontal scroll. Returns the nav box for further checks.
 */
const expectNavTabsToFit = async (page: Page) => {
  const nav = await page.locator("nav").boundingBox();
  const first = await page
    .getByRole("link", { name: "Cruise '27" })
    .boundingBox();
  const last = await page
    .getByRole("link", { name: "Brewery Run" })
    .boundingBox();

  // boundingBox() resolves to null for anything not rendered, so fail loudly rather
  // than letting the comparisons below blow up on a property of null.
  if (!nav || !first || !last) {
    throw new Error("Navigation did not render its tabs");
  }

  expect(first.x).toBeGreaterThanOrEqual(nav.x);
  expect(last.x + last.width).toBeLessThanOrEqual(nav.x + nav.width);

  return nav;
};

test.describe("Baltic Cruise 2027 placeholder", () => {
  test("should be the landing page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/baltic-cruise-3$/);
    await expect(page).toHaveTitle("MRC Baltic Cruise 2027");
  });

  test("should show the three cities in route order with Easter dates", async ({
    page,
  }) => {
    await page.goto("/baltic-cruise-3");

    await expect(page.getByRole("heading", { level: 3 })).toHaveText([
      "Tallinn",
      "Helsinki",
      "Stockholm",
    ]);

    await expect(page.getByText("Fri 26.3.2027")).toBeVisible();
    await expect(page.getByText("Sat 27.3.2027")).toBeVisible();
    await expect(page.getByText("Sun 28.3.2027")).toBeVisible();

    await expect(page.getByText("March 26–28, 2027 (Easter)")).toBeVisible();
  });

  test("should fit all four nav tabs on a 375px screen", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/baltic-cruise-3");

    const nav = await expectNavTabsToFit(page);

    // Going edge to edge is what buys back the room at this width.
    expect(nav.x).toBe(0);
  });

  test("should float as an inset bar from 390px up", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 667 });
    await page.goto("/baltic-cruise-3");

    const nav = await expectNavTabsToFit(page);

    expect(nav.x).toBeGreaterThan(0);
  });

  test("should not offer agendas yet", async ({ page }) => {
    await page.goto("/baltic-cruise-3");

    await expect(page.getByRole("button", { name: "View Agenda" })).toHaveCount(
      0,
    );
  });
});

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
