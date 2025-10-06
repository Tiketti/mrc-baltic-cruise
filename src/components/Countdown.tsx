import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEventDay: boolean;
  isPast: boolean;
}

const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  // Check if it's the event day
  const isEventDay = now.toDateString() === targetDate.toDateString();

  // Check if event has passed
  const isPast = difference < 0;

  if (isPast) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEventDay: false,
      isPast: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isEventDay, isPast };
};

export const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(targetDate),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeRemaining.isPast) {
    return (
      <div className="text-center text-gray-400 text-sm">
        <p>Event has concluded</p>
      </div>
    );
  }

  if (timeRemaining.isEventDay) {
    return (
      <div className="text-center">
        <p className="font-bold text-brand-yellow text-xl">TODAY IS THE DAY!</p>
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
