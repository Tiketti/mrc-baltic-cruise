import type { BreweryStop } from "../breweryData";

interface BreweryCardProps {
  stop: BreweryStop;
  isLast?: boolean;
  isCurrentStop?: boolean; // Currently at this brewery
  isCurrentTransition?: boolean; // Currently running to this brewery
}

export const BreweryCard = ({
  stop,
  isLast = false,
  isCurrentStop = false,
  isCurrentTransition = false,
}: BreweryCardProps) => {
  const timeText = stop.meetTime
    ? `Meet: ${stop.meetTime} / Depart: ${stop.departTime}`
    : isLast
      ? `Arrive: ${stop.arriveTime}`
      : `Arrive: ${stop.arriveTime} / Depart: ${stop.departTime}`;

  return (
    <div className="relative">
      {/* Brewery Card */}
      <div
        className={`relative rounded-2xl p-4 text-gray-900 shadow-lg transition-all duration-1000 ${
          isCurrentStop
            ? "animate-pulse-slow bg-brand-blue/20 shadow-xl ring-4 ring-brand-blue" // Currently at this brewery
            : "bg-gray-200"
        }`}
      >
        <div className="flex items-center space-x-4">
          {/* Brewery Logo */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
            <img
              src={stop.logo}
              alt={`${stop.name} logo`}
              className={`h-full w-full object-contain ${stop.logoClasses || ""}`}
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<span class="font-bold text-xs text-gray-800">LOGO</span>';
                }
              }}
            />
          </div>

          {/* Brewery Info */}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{stop.name}</h3>
            <p className="text-gray-600 text-sm">{timeText}</p>
          </div>
        </div>
      </div>

      {/* Distance Indicator (not for last stop) */}
      {!isLast && stop.distanceToNext && (
        <div
          className={`flex items-center justify-center py-4 transition-all duration-1000 ${
            isCurrentTransition ? "animate-pulse" : ""
          }`}
        >
          <div
            className={`flex items-center space-x-2 rounded-full px-4 py-2 ${
              isCurrentTransition
                ? "bg-brand-yellow text-black shadow-lg" // Currently running this leg
                : "bg-transparent"
            }`}
          >
            {/* Distance */}
            <span
              className={`font-semibold text-lg ${
                isCurrentTransition ? "text-black" : "text-white"
              }`}
            >
              {stop.distanceToNext} km
            </span>

            {/* Simple arrow pointing down */}
            <div
              className={`text-xl ${
                isCurrentTransition ? "text-black" : "text-white"
              }`}
            >
              ↓
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
