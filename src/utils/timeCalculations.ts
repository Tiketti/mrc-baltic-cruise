import type { BreweryStop } from "../breweryData";

// Convert time string (e.g., "13:30") to minutes since midnight
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);

  return hours * 60 + minutes;
};

// Calculate current brewery run status based on current time
export const calculateCurrentStatus = (
  breweryStops: BreweryStop[],
  currentTime?: Date,
) => {
  const now = currentTime || new Date();

  // Only show highlighting if we have a mock time (testing) or it's actually the event date
  // For now, only highlight when testing with mockTime parameter
  if (!currentTime) {
    // No mock time provided, so don't highlight anything
    return { currentStopIndex: -1, currentTransitionIndex: -1 };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentStopIndex = -1;
  let currentTransitionIndex = -1;

  for (let i = 0; i < breweryStops.length; i++) {
    const stop = breweryStops[i];

    // Determine arrival and departure times
    const arrivalTime = stop.meetTime || stop.arriveTime;
    const departureTime = stop.departTime;

    if (!arrivalTime) {
      continue;
    }

    const arrivalMinutes = timeToMinutes(arrivalTime);
    const departureMinutes = departureTime
      ? timeToMinutes(departureTime)
      : null;

    // Check if we're currently at this stop
    if (departureMinutes) {
      if (
        currentMinutes >= arrivalMinutes &&
        currentMinutes < departureMinutes
      ) {
        currentStopIndex = i;
        break;
      }

      // Check if we're running to the next stop
      const nextStop = breweryStops[i + 1];

      if (nextStop?.arriveTime) {
        const nextArrivalMinutes = timeToMinutes(nextStop.arriveTime);
        if (
          currentMinutes >= departureMinutes &&
          currentMinutes < nextArrivalMinutes
        ) {
          currentTransitionIndex = i; // Running FROM this stop TO the next

          break;
        }
      }
    } else {
      // Final stop - check if we've arrived
      if (currentMinutes >= arrivalMinutes) {
        currentStopIndex = i;

        break;
      }
    }
  }

  return {
    currentStopIndex,
    currentTransitionIndex,
  };
};
