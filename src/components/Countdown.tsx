import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface CountdownProps {
  targetDate: Date;
  currentTime?: Date;
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
  currentTime?: Date,
): TimeRemaining => {
  const now = currentTime || new Date();

  // Create event start time at 12:45 on the target date
  const eventStartTime = new Date(targetDate);
  eventStartTime.setHours(12, 45, 0, 0);

  const difference = eventStartTime.getTime() - now.getTime();

  // Check if the event has started (it's past 12:45 on event day)
  const isEventStarted =
    difference <= 0 && now.toDateString() === targetDate.toDateString();

  // Check if event day has completely passed
  const isPast =
    now.toDateString() !== targetDate.toDateString() && difference < 0;

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

export const Countdown = ({ targetDate, currentTime }: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(targetDate, currentTime),
  );
  const [confettiLaunched, setConfettiLaunched] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate, currentTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, currentTime]);

  // Trigger confetti when event starts
  useEffect(() => {
    if (timeRemaining.isEventStarted && !confettiLaunched) {
      setConfettiLaunched(true);

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
  }, [timeRemaining.isEventStarted, confettiLaunched]);

  if (timeRemaining.isPast) {
    return (
      <div className="text-center text-gray-400 text-sm">
        <p>Event has concluded</p>
      </div>
    );
  }

  if (timeRemaining.isEventStarted) {
    return (
      <div className="text-center">
        <p className="animate-pulse font-bold font-mikkelwind text-3xl text-brand-burgundy text-gray-900">
          TODAY! LET'S GO!
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex justify-center space-x-4 text-white">
        <div className="flex flex-col">
          <span className="font-bold font-mikkelwind text-4xl">
            {timeRemaining.days}
          </span>
          <span className="text-gray-400 text-xs">days</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold font-mikkelwind text-4xl">
            {timeRemaining.hours}
          </span>
          <span className="text-gray-400 text-xs">hours</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold font-mikkelwind text-4xl">
            {timeRemaining.minutes}
          </span>
          <span className="text-gray-400 text-xs">min</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold font-mikkelwind text-4xl">
            {timeRemaining.seconds}
          </span>
          <span className="text-gray-400 text-xs">sec</span>
        </div>
      </div>
    </div>
  );
};
