import { breweryStops } from "../breweryData";
import { ScheduleTab } from "../components/ScheduleTab";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { calculateCurrentStatus } from "../utils/timeCalculations";

export const BreweryRun = () => {
  useDocumentTitle("Brewery Run 2025 | MRC Helsinki");

  // Tab functionality temporarily hidden for focused brewery run launch
  // const [activeTab, setActiveTab] = useState<"schedule" | "map">("schedule");

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
      <div className="mx-auto max-w-md px-4 py-8">
        <h1 className="mb-8 text-center font-bold text-3xl tracking-wider">
          BREWERY RUN 2025
        </h1>

        {/* Tab Navigation - temporarily hidden for focused launch */}
        {/* 
        <div className="mb-6 flex rounded-lg bg-gray-800 p-1">
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
            onClick={() => setActiveTab("map")}
            className={`flex-1 rounded-md border-0 px-4 py-2 text-center font-medium text-sm outline-none transition-colors ${
              activeTab === "map"
                ? "bg-brand-blue text-white shadow-sm"
                : "bg-transparent text-gray-300 hover:text-white"
            }`}
            style={activeTab === "map" ? { color: "white" } : undefined}
          >
            Map
          </button>
        </div>
        */}

        {/* Schedule Content - always visible for focused launch */}
        <ScheduleTab
          currentStopIndex={currentStopIndex}
          currentTransitionIndex={currentTransitionIndex}
        />
      </div>
    </div>
  );
};
