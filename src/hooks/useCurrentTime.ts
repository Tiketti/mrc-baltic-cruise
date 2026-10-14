import { useEffect, useState } from "react";

// Re-renders the caller periodically so time-based UI doesn't freeze at page load
export const useCurrentTime = (intervalMs = 15_000) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return now;
};
