import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { breweryStops, eventDate } from "../breweryData";
import { Countdown } from "../components/Countdown";
import { MapTab } from "../components/MapTab";
import { ScheduleTab } from "../components/ScheduleTab";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useCurrentTime } from "../hooks/useCurrentTime";
import { useLiveTrackUrl } from "../hooks/useLiveTrackUrl";
import { calculateCurrentStatus, isSameDay } from "../utils/timeCalculations";
import { FALLBACK_MAP_URL, SHOW_ROUTE_TAB } from "../constants";

type TabType = "schedule" | "route" | "live";

export const BreweryRun = () => {
  const eventYear = eventDate.getFullYear();

  useDocumentTitle(`Brewery Run ${eventYear} | MRC Helsinki`);

  const navigate = useNavigate();
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHeaderTap = () => {
    tapCountRef.current += 1;

    // Clear any existing timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    if (tapCountRef.current === 5) {
      toast.success("Taking you to the admin zone...", {
        duration: 2000,
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #10b981",
        },
      });

      // Small delay so user can see the toast before navigation
      setTimeout(() => {
        navigate("/admin");
      }, 1_000);

      tapCountRef.current = 0;
    } else {
      // Reset tap count after 1.5 seconds of inactivity
      tapTimeoutRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 800);
    }
  };

  const {
    liveTrackUrl,
    isLiveTrackRecent,
    isLive,
    showFinishedMessage,
    finishedTimestamp,
    loading: liveTrackLoading,
  } = useLiveTrackUrl();

  // Initialize tab from URL hash
  const getInitialTab = (): TabType => {
    const [hash, misplacedQuery] = window.location.hash.slice(1).split("?");

    // The page appends #tab on load, so a ?mockTime typed onto the end of the URL
    // lands inside the hash. Move it to the real query string where it gets read.
    if (misplacedQuery) {
      const { pathname, search } = window.location;
      const query = search
        ? `${search}&${misplacedQuery}`
        : `?${misplacedQuery}`;

      window.history.replaceState(
        window.history.state,
        "",
        `${pathname}${query}#${hash}`,
      );
    }

    if (SHOW_ROUTE_TAB && (hash === "route" || hash === "map")) {
      return "route";
    }
    if (hash === "live") {
      return "live";
    }

    return "schedule";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

  // Update hash when tab changes. Assigning location.hash would be a navigation, which
  // WebKit lets cancel one already underway, e.g. a link tapped while the page settles.
  // It would also stack up history entries that Back can't turn into tab switches.
  useEffect(() => {
    window.history.replaceState(window.history.state, "", `#${activeTab}`);
  }, [activeTab]);

  // If live tab is active but live track is no longer recent, fall back to the route
  // map, or the schedule while there's no map to show
  useEffect(() => {
    if (activeTab === "live" && !isLiveTrackRecent) {
      setActiveTab(SHOW_ROUTE_TAB ? "route" : "schedule");
    }
  }, [activeTab, isLiveTrackRecent]);

  const showLiveTab = Boolean(isLiveTrackRecent && liveTrackUrl);

  // A tab bar with only "Schedule" in it would be a pointless button
  const showTabBar = SHOW_ROUTE_TAB || showLiveTab;

  // ?mockTime=13:00 (also 13.00 or 9:30) pretends it's that time on the event day.
  // It's an offset from the real clock rather than a frozen time, so the page keeps
  // ticking: ?mockTime=12:29 shows the countdown hitting zero and the confetti a minute later.
  const getMockOffsetMs = (): number | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    const match = urlParams.get("mockTime")?.match(/^(\d{1,2})[:.](\d{2})$/);

    if (!match) {
      return undefined;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours > 23 || minutes > 59) {
      return undefined;
    }

    const mockDate = new Date(eventDate);
    mockDate.setHours(hours, minutes, 0, 0);

    return mockDate.getTime() - Date.now();
  };

  // Read once, after getInitialTab has moved a misplaced ?mockTime out of the hash.
  // Recomputing on every render would reset the offset and freeze the mocked clock.
  const [mockOffsetMs] = useState(getMockOffsetMs);
  const realNow = useCurrentTime();
  const now = new Date(realNow.getTime() + (mockOffsetMs ?? 0));

  // Only highlight on the event day, otherwise a visit at 14:00 on any Tuesday would
  // claim the group is at a brewery
  const statusTime = isSameDay(now, eventDate) ? now : undefined;

  const { currentStopIndex, currentTransitionIndex } = calculateCurrentStatus(
    breweryStops,
    statusTime,
  );

  return (
    <div data-theme="2026" className="min-h-screen bg-gray-900 text-white">
      {/* The nav floats 1rem below the top edge, relying on the cruise pages' sticky header
          to fill in behind it. This header scrolls away, so this strip stays pinned behind the
          nav instead. 4.75rem clears the nav's bottom edge, which sits at ~4.6rem. */}
      <div className="sticky top-0 z-40 h-[4.75rem] bg-primary shadow-edge-to-edge" />

      <header className="bg-primary px-2 pb-3 text-center shadow-edge-to-edge">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Easter egg feature - intentionally mouse/tap only */}
        <h1
          className="cursor-pointer select-none p-2 text-4xl text-surface tracking-wide sm:text-5xl md:text-6xl"
          onClick={handleHeaderTap}
        >
          BREWERY RUN {eventYear}
        </h1>
      </header>

      <div className="mx-auto w-full max-w-md px-4 py-8 md:max-w-2xl lg:max-w-4xl">
        <div className="mb-4">
          <Countdown targetDate={eventDate} timeOffsetMs={mockOffsetMs} />
        </div>

        {showTabBar && (
          <div className="mb-2 flex rounded-lg bg-gray-800 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 rounded-md border-0 px-4 py-2 text-center font-medium text-sm outline-none transition-colors ${
                activeTab === "schedule"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-transparent text-gray-300 hover:text-white"
              }`}
              style={activeTab === "schedule" ? { color: "white" } : undefined}
            >
              Schedule
            </button>
            {SHOW_ROUTE_TAB && (
              <button
                type="button"
                onClick={() => setActiveTab("route")}
                className={`flex-1 rounded-md border-0 px-4 py-2 text-center font-medium text-sm outline-none transition-colors ${
                  activeTab === "route"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-transparent text-gray-300 hover:text-white"
                }`}
                style={activeTab === "route" ? { color: "white" } : undefined}
              >
                Route
              </button>
            )}
            {showLiveTab && (
              <button
                type="button"
                onClick={() => setActiveTab("live")}
                className={`flex-1 rounded-md border-0 px-4 py-2 text-center font-medium text-sm outline-none transition-colors ${
                  activeTab === "live"
                    ? "bg-primary text-white shadow-sm"
                    : "bg-transparent text-gray-300 hover:text-white"
                }`}
                style={activeTab === "live" ? { color: "white" } : undefined}
              >
                <span className="inline-flex items-center gap-1.5">
                  Live
                  {isLive && (
                    <Eye
                      className="animate-pulse text-red-500"
                      size={16}
                      strokeWidth={2.5}
                    />
                  )}
                </span>
              </button>
            )}
          </div>
        )}

        {activeTab === "schedule" ? (
          <ScheduleTab
            currentStopIndex={currentStopIndex}
            currentTransitionIndex={currentTransitionIndex}
          />
        ) : (
          <MapTab
            url={
              activeTab === "live" && liveTrackUrl
                ? liveTrackUrl
                : FALLBACK_MAP_URL
            }
            title={activeTab === "live" ? "Live Track" : "Route Map"}
            loading={liveTrackLoading}
            showFinishedMessage={activeTab === "live" && showFinishedMessage}
            finishedTimestamp={finishedTimestamp}
          />
        )}
      </div>
    </div>
  );
};
