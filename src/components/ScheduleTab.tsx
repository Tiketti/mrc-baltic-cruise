import { breweryStops, eventDate, totalDistance } from "../breweryData";
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
        <p>Total Distance: {totalDistance} km</p>
        <p className="mt-2">Helsinki • {eventDate.getFullYear()}</p>
      </div>
    </>
  );
};
