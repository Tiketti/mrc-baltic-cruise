import type { BreweryStop } from "../breweryData";

// Convert time string (e.g., "13:30") to minutes since midnight
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);

  return hours * 60 + minutes;
};

export const isSameDay = (a: Date, b: Date): boolean =>
  a.toDateString() === b.toDateString();

// Calculate current brewery run status based on the time of day.
// Callers pass no time when it isn't the event day, so nothing gets highlighted.
export const calculateCurrentStatus = (
  breweryStops: BreweryStop[],
  currentTime?: Date,
) => {
  if (!currentTime) {
    return { currentStopIndex: -1, currentTransitionIndex: -1 };
  }

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

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
