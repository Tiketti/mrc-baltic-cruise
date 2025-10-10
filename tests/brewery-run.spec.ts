import { expect, test } from "@playwright/test";

test.describe("Brewery Run", () => {
  test("should load the brewery run page", async ({ page }) => {
    await page.goto("/brewery-run");

    await expect(page).toHaveTitle(/Brewery Run 2025/);
    await expect(
      page.getByRole("heading", { name: "BREWERY RUN 2025" }),
    ).toBeVisible();
  });

  test("should have Schedule and Route tabs by default", async ({ page }) => {
    await page.goto("/brewery-run");

    // Check that Schedule and Route tabs are visible
    await expect(page.getByRole("button", { name: "Schedule" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Route" })).toBeVisible();

    // Live tab should not be visible without active event
    await expect(page.getByRole("button", { name: "Live" })).not.toBeVisible();
  });

  test("should show schedule content by default", async ({ page }) => {
    await page.goto("/brewery-run");

    // Should show schedule content (brewery stops)
    await expect(page.getByText(/CoolHead Brew/i)).toBeVisible();
    await expect(page.getByText(/Masis Brewery/i)).toBeVisible();
  });

  test("should switch between Schedule and Route tabs", async ({ page }) => {
    await page.goto("/brewery-run");

    // Click Route tab
    await page.getByRole("button", { name: "Route" }).click();

    // Should show map iframe
    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible();

    // Switch back to Schedule
    await page.getByRole("button", { name: "Schedule" }).click();

    // Should show schedule content again
    await expect(page.getByText(/CoolHead Brew/i)).toBeVisible();
  });

  test("should show countdown to event", async ({ page }) => {
    await page.goto("/brewery-run");

    // Countdown should be visible (exact text depends on current date)
    // Just check that some countdown-related text is visible
    const countdownSection = page.locator("text=/days|hours|minutes/i").first();
    await expect(countdownSection).toBeVisible();
  });

  test("should display brewery stops with distances", async ({ page }) => {
    await page.goto("/brewery-run");

    // Check that distances are shown (km format)
    await expect(page.getByText(/km/i).first()).toBeVisible();

    // Check for brewery names in the schedule
    const breweries = [
      "CoolHead Brew",
      "Masis Brewery",
      "Olarin Panimo",
      "Solmu Brewery",
      "Salamanation",
      "Tired Uncle Brewing",
    ];

    for (const brewery of breweries) {
      await expect(page.getByText(new RegExp(brewery, "i"))).toBeVisible();
    }
  });

  test("should respect URL hash for initial tab", async ({ page, context }) => {
    // Test #route hash by loading in a fresh page context
    await page.goto("/brewery-run#route");
    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible();

    // Test #schedule hash by creating a new page (fresh load)
    const page2 = await context.newPage();
    await page2.goto("/brewery-run#schedule");

    // Should show Schedule content on fresh load
    await expect(page2.getByText(/CoolHead Brew/i)).toBeVisible();
    await page2.close();
  });
});

test.describe("Brewery Run - Live Track Feature", () => {
  test("should show Live tab when event is active", async ({
    page,
    context,
  }) => {
    // Mock the API response for an active event
    await context.route(
      "**/livetrack-api.perttu-468.workers.dev/api/livetrack",
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            url: "https://livetrack.garmin.com/session/test123",
            timestamp: new Date().toISOString(), // Current time
            isLive: true,
          }),
        });
      },
    );

    await page.goto("/brewery-run");

    // Wait for the Live tab to appear
    await expect(page.getByRole("button", { name: /Live/i })).toBeVisible({
      timeout: 5000,
    });

    // Check for pulsing eye icon (svg element)
    const liveButton = page.getByRole("button", { name: /Live/i });
    await expect(liveButton.locator("svg")).toBeVisible();
  });

  test("should show finished message when event just ended", async ({
    page,
    context,
  }) => {
    // Mock the API response for a recently finished event (< 2 hours ago)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    await context.route(
      "**/livetrack-api.perttu-468.workers.dev/api/livetrack",
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            url: "https://livetrack.garmin.com/session/test123",
            timestamp: oneHourAgo.toISOString(),
            isLive: false,
          }),
        });
      },
    );

    await page.goto("/brewery-run");

    // Wait for Live tab to appear
    await expect(page.getByRole("button", { name: "Live" })).toBeVisible({
      timeout: 5000,
    });

    // Live tab should NOT have the pulsing eye icon
    const liveButton = page.getByRole("button", { name: "Live" });
    await expect(liveButton.locator("svg")).not.toBeVisible();

    // Click the Live tab
    await liveButton.click();

    // Should show "Event Finished" message
    await expect(
      page.getByRole("heading", { name: "Event Finished" }),
    ).toBeVisible();
    await expect(page.getByText(/The run ended at/i)).toBeVisible();
    await expect(
      page.getByText(/may still be at the final brewery/i),
    ).toBeVisible();
  });

  test("should hide Live tab when event is old", async ({ page, context }) => {
    // Mock the API response for an old event (> 2 hours ago)
    const threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

    await context.route(
      "**/livetrack-api.perttu-468.workers.dev/api/livetrack",
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            url: "https://livetrack.garmin.com/session/test123",
            timestamp: threeHoursAgo.toISOString(),
            isLive: false,
          }),
        });
      },
    );

    await page.goto("/brewery-run");

    // Wait a moment for API call to complete
    await page.waitForTimeout(1000);

    // Live tab should NOT be visible
    await expect(page.getByRole("button", { name: "Live" })).not.toBeVisible();

    // Only Schedule and Route tabs should be visible
    await expect(page.getByRole("button", { name: "Schedule" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Route" })).toBeVisible();
  });

  test("should fallback to route map when API fails", async ({
    page,
    context,
  }) => {
    // Mock API failure
    await context.route(
      "**/livetrack-api.perttu-468.workers.dev/api/livetrack",
      (route) => {
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal server error" }),
        });
      },
    );

    await page.goto("/brewery-run");

    // Wait a moment for API call to complete
    await page.waitForTimeout(1000);

    // Should only show Schedule and Route tabs (no Live tab)
    await expect(page.getByRole("button", { name: "Schedule" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Route" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Live" })).not.toBeVisible();

    // Click Route tab - should show static map
    await page.getByRole("button", { name: "Route" }).click();
    const iframe = page.locator("iframe");
    await expect(iframe).toBeVisible();
  });

  test("should switch to route tab when live event expires", async ({
    page,
    context,
  }) => {
    // Start with active event
    let isLive = true;
    const timestamp = new Date();

    await context.route(
      "**/livetrack-api.perttu-468.workers.dev/api/livetrack",
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            url: "https://livetrack.garmin.com/session/test123",
            timestamp: timestamp.toISOString(),
            isLive: isLive,
          }),
        });
      },
    );

    await page.goto("/brewery-run");

    // Wait for Live tab
    await expect(page.getByRole("button", { name: /Live/i })).toBeVisible({
      timeout: 5000,
    });

    // Click Live tab
    await page.getByRole("button", { name: /Live/i }).click();

    // Now simulate the event being marked as finished
    isLive = false;
    timestamp.setHours(timestamp.getHours() - 3); // 3 hours ago

    // Reload the page
    await page.reload();

    // Wait for page to settle
    await page.waitForTimeout(1000);

    // Live tab should no longer be visible (> 2 hours and not live)
    await expect(page.getByRole("button", { name: "Live" })).not.toBeVisible();
  });
});

test.describe("Brewery Run - Admin Navigation", () => {
  test("should navigate to admin page from map", async ({ page }) => {
    await page.goto("/brewery-run#route");

    // Admin link should be accessible (though might not be visible in default view)
    // This is more of a smoke test to ensure the route exists
    await page.goto("/admin");

    await expect(
      page.getByRole("heading", { name: "Admin Dashboard" }),
    ).toBeVisible();
  });
});
