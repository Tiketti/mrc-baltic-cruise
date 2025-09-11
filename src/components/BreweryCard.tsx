import type { BreweryStop } from "../breweryData";

interface BreweryCardProps {
  stop: BreweryStop;
  isLast?: boolean;
}

export const BreweryCard = ({ stop, isLast = false }: BreweryCardProps) => {
  const timeText = stop.meetTime
    ? `Meet: ${stop.meetTime} / Depart: ${stop.departTime}`
    : isLast
      ? `Arrive: ${stop.arriveTime}`
      : `Arrive: ${stop.arriveTime} / Depart: ${stop.departTime}`;

  return (
    <div className="relative">
      {/* Brewery Card */}
      <div className="relative rounded-2xl bg-gray-200 p-4 text-gray-900 shadow-lg">
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

      {/* Distance and Running Icon (not for last stop) */}
      {!isLast && stop.distanceToNext && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-2">
            {/* Running Icon */}
            <div className="text-2xl">🏃‍♂️</div>

            {/* Distance */}
            <span className="font-semibold text-lg text-white">
              {stop.distanceToNext} km
            </span>

            {/* Arrow pointing down */}
            <div className="text-2xl text-white">↓</div>
          </div>
        </div>
      )}
    </div>
  );
};
