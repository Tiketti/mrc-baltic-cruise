import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { breweryStops, eventDate } from "../breweryData";
import { Countdown } from "../components/Countdown";
import { MapTab } from "../components/MapTab";
import { ScheduleTab } from "../components/ScheduleTab";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useLiveTrackUrl } from "../hooks/useLiveTrackUrl";
import { calculateCurrentStatus } from "../utils/timeCalculations";
import { FALLBACK_MAP_URL } from "../constants";

type TabType = "schedule" | "route" | "live";

export const BreweryRun = () => {
  useDocumentTitle("Brewery Run 2025 | MRC Helsinki");

  const navigate = useNavigate();
  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    const hash = window.location.hash.slice(1);

    if (hash === "route" || hash === "map") {
      return "route";
    }
    if (hash === "live") {
      return "live";
    }

    return "schedule";
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

  // Update hash when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // If live tab is active but live track is no longer recent, switch to route
  useEffect(() => {
    if (activeTab === "live" && !isLiveTrackRecent) {
      setActiveTab("route");
    }
  }, [activeTab, isLiveTrackRecent]);

  // Parse mock time from URL query parameter for testing
  // Format: ?mockTime=13:00 (just the time, assumes today's date)
  const getMockTime = (): Date | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    const mockTimeParam = urlParams.get("mockTime");

    if (mockTimeParam && /^\d{2}:\d{2}$/.test(mockTimeParam)) {
      const [hours, minutes] = mockTimeParam.split(":").map(Number);
      const mockDate = new Date();
      mockDate.setHours(hours, minutes, 0, 0);

      return mockDate;
    }

    return undefined;
  };

  // Calculate current status based on time (real or mocked)
  const mockTime = getMockTime();

  const { currentStopIndex, currentTransitionIndex } = calculateCurrentStatus(
    breweryStops,
    mockTime,
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto w-full max-w-md px-4 py-8 md:max-w-2xl lg:max-w-4xl">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Easter egg feature - intentionally mouse/tap only */}
        <h1
          className="mb-4 cursor-pointer select-none text-center font-bold text-3xl tracking-wider"
          onClick={handleHeaderTap}
        >
          BREWERY RUN 2025
        </h1>

        <div className="mb-4">
          <Countdown targetDate={eventDate} currentTime={mockTime} />
        </div>

        <div className="mb-2 flex rounded-lg bg-gray-800 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 rounded-md border-0 px-4 py-2 text-center font-medium text-sm outline-none transition-colors ${
              activeTab === "schedule"
                ? "bg-brand-blue text-white shadow-sm"
                : "bg-transparent text-gray-300 hover:text-white"
            }`}
            style={activeTab === "schedule" ? { color: "white" } : undefined}
          >
            Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("route")}
            className={`flex-1 rounded-md border-0 px-4 py-2 text-center font-medium text-sm outline-none transition-colors ${
              activeTab === "route"
                ? "bg-brand-blue text-white shadow-sm"
                : "bg-transparent text-gray-300 hover:text-white"
            }`}
            style={activeTab === "route" ? { color: "white" } : undefined}
          >
            Route
          </button>
          {isLiveTrackRecent && liveTrackUrl && (
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`flex-1 rounded-md border-0 px-4 py-2 text-center font-medium text-sm outline-none transition-colors ${
                activeTab === "live"
                  ? "bg-brand-blue text-white shadow-sm"
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
