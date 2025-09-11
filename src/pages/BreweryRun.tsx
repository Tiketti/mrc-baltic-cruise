import { breweryStops } from "../breweryData";
import { BreweryCard } from "../components/BreweryCard";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { calculateCurrentStatus } from "../utils/timeCalculations";

export const BreweryRun = () => {
  useDocumentTitle("Brewery Run 2025 | MRC Helsinki");

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
      <div className="mx-auto max-w-md px-4 pt-20 pb-8">
        <h1 className="mb-8 text-center font-bold text-3xl tracking-wider">
          BREWERY RUN 2025
        </h1>

        <div className="space-y-0">
          {breweryStops.map((stop, index) => (
            <BreweryCard
              key={stop.id}
              stop={stop}
              isLast={index === breweryStops.length - 1}
              isCurrentStop={index === currentStopIndex}
              isCurrentTransition={index === currentTransitionIndex}
            />
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            Total Distance:{" "}
            {breweryStops.reduce(
              (total, stop) => total + (stop.distanceToNext || 0),
              0,
            )}{" "}
            km
          </p>
          <p className="mt-2">Helsinki • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};
