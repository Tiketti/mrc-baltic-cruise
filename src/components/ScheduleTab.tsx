import { breweryStops } from "../breweryData";
import { BreweryCard } from "./BreweryCard";

interface ScheduleTabProps {
  currentStopIndex: number;
  currentTransitionIndex: number;
}

export const ScheduleTab = ({
  currentStopIndex,
  currentTransitionIndex,
}: ScheduleTabProps) => {
  return (
    <>
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
    </>
  );
};
