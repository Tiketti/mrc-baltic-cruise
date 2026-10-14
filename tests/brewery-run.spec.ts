import { type BrowserContext, type Page, expect, test } from "@playwright/test";
import {
  type BreweryStop,
  breweryStops,
  eventDate,
  fallbackTotalDistance,
  totalDistance,
} from "../src/breweryData";

const eventYear = eventDate.getFullYear();
const firstStop = breweryStops[0];
const lastStop = breweryStops[breweryStops.length - 1];

const stopHeading = (page: Page, stop: BreweryStop) =>
  page.getByRole("heading", { name: stop.name, exact: true });

// Mock the LiveTrack API to return no active event so tests don't
// depend on the real Cloudflare Worker state.
const mockNoLiveTrack = async (context: BrowserContext) => {
  await context.route(
    "**/livetrack-api.perttu-468.workers.dev/api/livetrack",
    (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: null, timestamp: null, isLive: false }),
      });
    },
  );
};

test.describe("Brewery Run", () => {
  test.beforeEach(async ({ context }) => {
    await mockNoLiveTrack(context);
  });

  test("should load the brewery run page", async ({ page }) => {
    await page.goto("/brewery-run");

    await expect(page).toHaveTitle(new RegExp(`Brewery Run ${eventYear}`));
    await expect(
      page.getByRole("heading", { name: `BREWERY RUN ${eventYear}` }),
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
    await expect(stopHeading(page, firstStop)).toBeVisible();
    await expect(stopHeading(page, lastStop)).toBeVisible();
  });

  test("should show the final stop's arrival label", async ({ page }) => {
    await page.goto("/brewery-run");

    await expect(
      page.getByText(lastStop.arriveLabel ?? "Arrive", { exact: true }),
    ).toBeVisible();
  });

  test("should switch between Schedule and Route tabs", async ({ page }) => {
    await page.goto("/brewery-run");

    // Click Route tab
    await page.getByRole("button", { name: "Route" }).click();

    // Should show route map image (local asset renders as img, not iframe)
    await expect(page.getByRole("img", { name: "Route Map" })).toBeVisible();

    // Switch back to Schedule
    await page.getByRole("button", { name: "Schedule" }).click();

    // Should show schedule content again
    await expect(stopHeading(page, firstStop)).toBeVisible();
  });

  test("should show countdown to event", async ({ page }) => {
    // Freeze time to one day before the event so the countdown is visible
    await page.clock.setFixedTime(
      new Date(eventDate.getTime() - 24 * 60 * 60 * 1_000),
    );

    await page.goto("/brewery-run");

    // Countdown should be visible (exact text depends on current date)
    // Just check that some countdown-related text is visible
    const countdownSection = page.locator("text=/days|hours|minutes/i").first();
    await expect(countdownSection).toBeVisible();
  });

  test("should display brewery stops with distances", async ({ page }) => {
    await page.goto("/brewery-run");

    for (const stop of breweryStops) {
      await expect(stopHeading(page, stop)).toBeVisible();
    }

    const legStops = breweryStops.slice(0, -1);
    const knownDistances = legStops.flatMap((stop) =>
      stop.distanceToNext === undefined ? [] : [stop.distanceToNext],
    );
    const unknownLegCount = legStops.length - knownDistances.length;

    for (const distance of new Set(knownDistances)) {
      await expect(
        page.getByText(`${distance} km`, { exact: true }).first(),
      ).toBeVisible();
    }

    await expect(page.getByText("Running", { exact: true })).toHaveCount(
      unknownLegCount,
    );

    const expectedTotal =
      totalDistance === null ? fallbackTotalDistance : `${totalDistance} km`;

    await expect(
      page.getByText(`Total Distance: ${expectedTotal}`),
    ).toBeVisible();
  });

  test("should respect URL hash for initial tab", async ({ page, context }) => {
    // Test #route hash by loading in a fresh page context
    await page.goto("/brewery-run#route");
    await expect(page.getByRole("img", { name: "Route Map" })).toBeVisible();

    // Test #schedule hash by creating a new page (fresh load)
    const page2 = await context.newPage();
    await page2.goto("/brewery-run#schedule");

    // Should show Schedule content on fresh load
    await expect(stopHeading(page2, firstStop)).toBeVisible();
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
    await expect(page.getByRole("img", { name: "Route Map" })).toBeVisible();
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

const ONE_MINUTE_MS = 60 * 1_000;
const ONE_DAY_MS = 24 * 60 * ONE_MINUTE_MS;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const shiftTime = (time: string, deltaMinutes: number) => {
  const total = toMinutes(time) + deltaMinutes;
  const hours = String(Math.floor(total / 60)).padStart(2, "0");
  const minutes = String(total % 60).padStart(2, "0");

  return `${hours}:${minutes}`;
};

// "HH:MM" on the event day, or on a day relative to it
const onEventDay = (time: string, dayOffset = 0) => {
  const date = new Date(eventDate.getTime() + dayOffset * ONE_DAY_MS);
  const [hours, minutes] = time.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);

  return date;
};

const arrivalOf = (stop: BreweryStop) => stop.meetTime ?? stop.arriveTime ?? "";

// Every stop except the last starts a leg that ends at the next stop
const legs = breweryStops.flatMap((stop, index) => {
  const nextStop = breweryStops[index + 1];

  return stop.departTime && nextStop?.arriveTime
    ? [{ from: stop, to: nextStop, departTime: stop.departTime }]
    : [];
});

const expectCurrentStop = async (page: Page, stop: BreweryStop) => {
  const currentStop = page.locator('[aria-current="step"]');

  await expect(currentStop).toHaveCount(1);
  await expect(
    currentStop.getByRole("heading", { name: stop.name, exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Running Now")).toHaveCount(0);
};

const expectRunningLegFrom = async (page: Page, stop: BreweryStop) => {
  await expect(page.locator('[aria-current="step"]')).toHaveCount(0);
  await expect(page.getByText("Running Now")).toHaveCount(1);
  await expect(
    page.locator(`[data-stop-id="${stop.id}"]`).getByText("Running Now"),
  ).toBeVisible();
};

const expectNothingHighlighted = async (page: Page) => {
  // Wait for the schedule so the empty checks below can't pass on a blank page
  await expect(stopHeading(page, firstStop)).toBeVisible();
  await expect(page.locator('[aria-current="step"]')).toHaveCount(0);
  await expect(page.getByText("Running Now")).toHaveCount(0);
};

test.describe("Brewery Run - Highlighting with mockTime", () => {
  test.beforeEach(async ({ context, page }) => {
    await mockNoLiveTrack(context);

    // A week before the event, so any highlighting must come from mockTime
    await page.clock.setFixedTime(onEventDay("10:00", -7));
  });

  for (const stop of breweryStops) {
    test(`should highlight ${stop.name} from its arrival time`, async ({
      page,
    }) => {
      await page.goto(`/brewery-run?mockTime=${arrivalOf(stop)}`);

      await expectCurrentStop(page, stop);
    });
  }

  for (const { from, to, departTime } of legs) {
    test(`should highlight the leg from ${from.name} to ${to.name}`, async ({
      page,
    }) => {
      await page.goto(`/brewery-run?mockTime=${departTime}`);

      await expectRunningLegFrom(page, from);
    });

    test(`should still be at ${from.name} a minute before departure`, async ({
      page,
    }) => {
      await page.goto(`/brewery-run?mockTime=${shiftTime(departTime, -1)}`);

      await expectCurrentStop(page, from);
    });
  }

  test("should highlight nothing before the first meet time", async ({
    page,
  }) => {
    await page.goto(
      `/brewery-run?mockTime=${shiftTime(arrivalOf(firstStop), -1)}`,
    );

    await expectNothingHighlighted(page);
  });

  test("should accept mockTime typed after the tab hash", async ({ page }) => {
    await page.goto(`/brewery-run#schedule?mockTime=${arrivalOf(lastStop)}`);

    await expectCurrentStop(page, lastStop);
    await expect(page).toHaveURL(
      new RegExp(`\\?mockTime=${arrivalOf(lastStop)}#schedule$`),
    );
  });

  test("should accept a dot as the time separator", async ({ page }) => {
    await page.goto(
      `/brewery-run?mockTime=${arrivalOf(lastStop).replace(":", ".")}`,
    );

    await expectCurrentStop(page, lastStop);
  });

  for (const malformed of [`${arrivalOf(lastStop)}pm`, "25:00"]) {
    test(`should ignore a malformed mockTime (${malformed})`, async ({
      page,
    }) => {
      await page.goto(`/brewery-run?mockTime=${malformed}`);

      await expectNothingHighlighted(page);
    });
  }
});

test.describe("Brewery Run - Highlighting with actual time", () => {
  const secondStop = breweryStops[1];
  const firstLeg = legs[0];

  test.beforeEach(async ({ context }) => {
    await mockNoLiveTrack(context);
  });

  test("should highlight the current stop on the event day", async ({
    page,
  }) => {
    await page.clock.setFixedTime(onEventDay(arrivalOf(secondStop)));
    await page.goto("/brewery-run");

    await expectCurrentStop(page, secondStop);
  });

  test("should highlight the running leg on the event day", async ({
    page,
  }) => {
    await page.clock.setFixedTime(onEventDay(firstLeg.departTime));
    await page.goto("/brewery-run");

    await expectRunningLegFrom(page, firstLeg.from);
  });

  test("should highlight nothing before the run starts", async ({ page }) => {
    await page.clock.setFixedTime(
      onEventDay(shiftTime(arrivalOf(firstStop), -1)),
    );
    await page.goto("/brewery-run");

    await expectNothingHighlighted(page);
  });

  for (const [label, dayOffset] of [
    ["the day before", -1],
    ["the day after", 1],
  ] as const) {
    test(`should highlight nothing at the same time ${label}`, async ({
      page,
    }) => {
      await page.clock.setFixedTime(
        onEventDay(arrivalOf(secondStop), dayOffset),
      );
      await page.goto("/brewery-run");

      await expectNothingHighlighted(page);
    });
  }

  test("should move the highlight along as time passes", async ({ page }) => {
    await page.clock.install({
      time: onEventDay(shiftTime(firstLeg.departTime, -1)),
    });
    await page.goto("/brewery-run");

    await expectCurrentStop(page, firstLeg.from);

    await page.clock.runFor(2 * ONE_MINUTE_MS);

    await expectRunningLegFrom(page, firstLeg.from);
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
