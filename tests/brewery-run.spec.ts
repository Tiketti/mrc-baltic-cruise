import { type BrowserContext, type Page, expect, test } from "@playwright/test";
import {
  type BreweryStop,
  breweryStops,
  eventDate,
  fallbackTotalDistance,
  totalDistance,
} from "../src/breweryData";
import { FALLBACK_MAP_URL } from "../src/constants";

const LIVE_TRACK_URL = "https://livetrack.garmin.com/session/test123";

const eventYear = eventDate.getFullYear();
const firstStop = breweryStops[0];
const lastStop = breweryStops[breweryStops.length - 1];

const stopHeading = (page: Page, stop: BreweryStop) =>
  page.getByRole("heading", { name: stop.name, exact: true });

const routeMap = (page: Page) => page.locator('iframe[title="Route Map"]');
const liveMap = (page: Page) => page.locator('iframe[title="Live Track"]');

const expectTabs = async (page: Page, { live }: { live: boolean }) => {
  const tab = (name: string) => page.getByRole("button", { name, exact: true });

  await expect(tab("Schedule")).toHaveCount(1);
  await expect(tab("Route")).toHaveCount(1);
  await expect(page.getByRole("button", { name: /^Live/ })).toHaveCount(
    live ? 1 : 0,
  );
};

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

  test("should show only the available tabs by default", async ({ page }) => {
    await page.goto("/brewery-run");

    await expectTabs(page, { live: false });
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

    await page.getByRole("button", { name: "Route" }).click();

    await expect(routeMap(page)).toBeVisible();
    await expect(routeMap(page)).toHaveAttribute("src", FALLBACK_MAP_URL);

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
    await expect(routeMap(page)).toBeVisible();

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

    await expectTabs(page, { live: false });
  });

  test("should hide the Live tab when the API fails", async ({
    page,
    context,
  }) => {
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

    await expectTabs(page, { live: false });
    await expect(stopHeading(page, firstStop)).toBeVisible();
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

    // Click Route tab - should show the planned course
    await page.getByRole("button", { name: "Route" }).click();
    await expect(routeMap(page)).toBeVisible();
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
    await expectTabs(page, { live: false });
    await expect(routeMap(page)).toBeVisible();
  });

  test.describe("while the event is live", () => {
    test.beforeEach(async ({ context }) => {
      await context.route(
        "**/livetrack-api.perttu-468.workers.dev/api/livetrack",
        (route) => {
          route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              url: LIVE_TRACK_URL,
              timestamp: new Date().toISOString(),
              isLive: true,
            }),
          });
        },
      );
    });

    test("should prefer the live track over the planned route", async ({
      page,
    }) => {
      await page.goto("/brewery-run#route");

      await expect(liveMap(page)).toHaveAttribute("src", LIVE_TRACK_URL);
      await expect(routeMap(page)).toHaveCount(0);
    });

    test("should honor a shared #live link", async ({ page }) => {
      await page.goto("/brewery-run#live");

      await expect(liveMap(page)).toHaveAttribute("src", LIVE_TRACK_URL);
    });

    test("should still let people look at the planned route", async ({
      page,
    }) => {
      await page.goto("/brewery-run#route");
      await expect(liveMap(page)).toBeVisible();

      await page.getByRole("button", { name: "Route", exact: true }).click();

      await expect(routeMap(page)).toHaveAttribute("src", FALLBACK_MAP_URL);
    });

    test("should leave the schedule alone", async ({ page }) => {
      await page.goto("/brewery-run");

      await expect(page.getByRole("button", { name: /^Live/ })).toBeVisible();
      await expect(stopHeading(page, firstStop)).toBeVisible();
    });
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

const eventStartTime = shiftTime(
  "00:00",
  eventDate.getHours() * 60 + eventDate.getMinutes(),
);

// canvas-confetti draws on a canvas it appends to <body> on the first burst
const confettiCanvas = (page: Page) => page.locator("body > canvas");

const confettiFlag = (page: Page) =>
  page.evaluate(() => sessionStorage.getItem("confettiLaunched"));

const expectConfetti = async (page: Page) => {
  await expect(confettiCanvas(page)).toHaveCount(1);
  expect(await confettiFlag(page)).toBe("true");
};

const expectNoConfetti = async (page: Page) => {
  // Longer than the countdown's 1s tick plus the first 250ms burst
  await page.waitForTimeout(1_500);
  await expect(confettiCanvas(page)).toHaveCount(0);
  expect(await confettiFlag(page)).toBeNull();
};

test.describe("Brewery Run - Confetti", () => {
  test.beforeEach(async ({ context }) => {
    await mockNoLiveTrack(context);
  });

  test("should launch on the first visit after the start on event day", async ({
    page,
  }) => {
    await page.clock.setFixedTime(onEventDay(shiftTime(eventStartTime, 30)));
    await page.goto("/brewery-run");

    await expect(page.getByText("TODAY! LET'S GO!")).toBeVisible();
    await expectConfetti(page);
  });

  test("should not launch again when reloading in the same session", async ({
    page,
  }) => {
    await page.clock.setFixedTime(onEventDay(shiftTime(eventStartTime, 30)));
    await page.goto("/brewery-run");
    await expectConfetti(page);

    await page.reload();

    await expect(page.getByText("TODAY! LET'S GO!")).toBeVisible();
    await page.waitForTimeout(1_500);
    await expect(confettiCanvas(page)).toHaveCount(0);
  });

  test("should launch when the countdown hits zero with the page open", async ({
    page,
  }) => {
    await page.clock.install({
      time: new Date(onEventDay(eventStartTime).getTime() - 10_000),
    });
    await page.goto("/brewery-run");

    await expect(page.getByText("sec", { exact: true })).toBeVisible();
    expect(await confettiFlag(page)).toBeNull();

    await page.clock.runFor(15_000);

    await expect(page.getByText("TODAY! LET'S GO!")).toBeVisible();
    await expectConfetti(page);
  });

  test("should not launch before the start on event day", async ({ page }) => {
    await page.clock.setFixedTime(onEventDay(shiftTime(eventStartTime, -1)));
    await page.goto("/brewery-run");

    await expect(page.getByText("sec", { exact: true })).toBeVisible();
    await expectNoConfetti(page);
  });

  test("should not launch the day after the event", async ({ page }) => {
    await page.clock.setFixedTime(onEventDay(shiftTime(eventStartTime, 30), 1));
    await page.goto("/brewery-run");

    await expect(page.getByText("Event has concluded")).toBeVisible();
    await expectNoConfetti(page);
  });

  test("should launch with a mockTime after the start", async ({ page }) => {
    await page.clock.setFixedTime(onEventDay("10:00", -7));
    await page.goto(`/brewery-run?mockTime=${shiftTime(eventStartTime, 30)}`);

    await expect(page.getByText("TODAY! LET'S GO!")).toBeVisible();
    await expectConfetti(page);
  });

  test("should keep a mockTime ticking up to the start", async ({ page }) => {
    await page.clock.install({ time: onEventDay("10:00", -7) });
    await page.goto(`/brewery-run?mockTime=${shiftTime(eventStartTime, -1)}`);

    await expect(page.getByText("sec", { exact: true })).toBeVisible();
    expect(await confettiFlag(page)).toBeNull();

    await page.clock.runFor(2 * ONE_MINUTE_MS);

    await expect(page.getByText("TODAY! LET'S GO!")).toBeVisible();
    await expectConfetti(page);
  });
});

test.describe("Brewery Run - Admin Navigation", () => {
  test("should navigate to admin page from the brewery run page", async ({
    page,
  }) => {
    // Leaving straight away is deliberate: the page rewrites #route while it settles,
    // and that used to cancel the next navigation in WebKit
    await page.goto("/brewery-run#route");
    await page.goto("/admin");

    await expect(
      page.getByRole("heading", { name: "Admin Dashboard" }),
    ).toBeVisible();
  });
});
