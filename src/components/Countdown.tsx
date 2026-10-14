import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

// Once per browser tab session: covers a reload, or hopping to another page and back
const CONFETTI_STORAGE_KEY = "confettiLaunched" as const;

interface CountdownProps {
  // Date and time the event starts; the countdown ends and confetti fires at this moment
  targetDate: Date;
  // Shifts the clock for manual testing, e.g. BreweryRun's ?mockTime
  timeOffsetMs?: number;
  // "dark" suits the near-black Brewery Run page; "brand" is for the lighter primary bands,
  // where gray-400 labels drop below AA contrast.
  tone?: "dark" | "brand";
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEventStarted: boolean;
  isPast: boolean;
}

const calculateTimeRemaining = (
  targetDate: Date,
  timeOffsetMs = 0,
): TimeRemaining => {
  const now = new Date(Date.now() + timeOffsetMs);
  const difference = targetDate.getTime() - now.getTime();
  const isEventDay = now.toDateString() === targetDate.toDateString();

  // Started stays true for the rest of the event day, then the event counts as over
  const isEventStarted = difference <= 0 && isEventDay;
  const isPast = difference < 0 && !isEventDay;

  if (isPast) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEventStarted: false,
      isPast: true,
    };
  }

  if (isEventStarted) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEventStarted: true,
      isPast: false,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isEventStarted, isPast };
};

// Storage can throw, e.g. when it's disabled. Missing confetti beats a crashed page.
const hasLaunchedConfetti = () => {
  try {
    return sessionStorage.getItem(CONFETTI_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const markConfettiLaunched = () => {
  try {
    sessionStorage.setItem(CONFETTI_STORAGE_KEY, "true");
  } catch {
    // Without storage the confetti can repeat on reload, which is harmless
  }
};

export const Countdown = ({
  targetDate,
  timeOffsetMs,
  tone = "dark",
}: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetDate, timeOffsetMs),
  );

  const valueClass = tone === "brand" ? "text-surface" : "text-white";
  // Fully opaque on brand bands: a dimmed label drops under AA on the lighter primaries.
  const labelClass = tone === "brand" ? "text-surface" : "text-gray-400";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate, timeOffsetMs));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, timeOffsetMs]);

  // Fires both when the countdown hits zero with the page open, and when the page is first
  // opened later on the event day. The session flag stops reloads from firing it again.
  useEffect(() => {
    if (timeRemaining.isEventStarted && !hasLaunchedConfetti()) {
      markConfettiLaunched();

      // Launch confetti with multiple bursts for maximum celebration!
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Launch from two different origins for better effect
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [timeRemaining.isEventStarted]);

  if (timeRemaining.isPast) {
    return (
      <div className={`text-center text-sm ${labelClass}`}>
        <p>Event has concluded</p>
      </div>
    );
  }

  if (timeRemaining.isEventStarted) {
    return (
      <div className="text-center">
        <p className="animate-pulse font-bold font-mikkelwind text-3xl text-accent text-gray-900">
          TODAY! LET'S GO!
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className={`flex justify-center space-x-4 ${valueClass}`}>
        <div className="flex flex-col">
          <span className="font-bold font-mikkelwind text-4xl">
            {timeRemaining.days}
          </span>
          <span className={`text-xs ${labelClass}`}>days</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold font-mikkelwind text-4xl">
            {timeRemaining.hours}
          </span>
          <span className={`text-xs ${labelClass}`}>hours</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold font-mikkelwind text-4xl">
            {timeRemaining.minutes}
          </span>
          <span className={`text-xs ${labelClass}`}>min</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold font-mikkelwind text-4xl">
            {timeRemaining.seconds}
          </span>
          <span className={`text-xs ${labelClass}`}>sec</span>
        </div>
      </div>
    </div>
  );
};
