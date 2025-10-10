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
  return (
    <div className="relative">
      {/* Brewery Card */}
      <div
        className={`relative overflow-hidden rounded-2xl text-gray-900 shadow-lg transition-all duration-1000 ${
          isCurrentStop
            ? "animate-pulse-slow bg-brand-blue/20 shadow-xl ring-4 ring-brand-blue"
            : "bg-gray-200"
        }`}
      >
        {/* Logo section - centered at top */}
        <div className="flex items-center justify-center bg-white/40 px-4 py-2">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
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
        </div>

        {/* Brewery name - centered */}
        <div className="px-4 pt-4 pb-2 text-center">
          <h3 className="font-bold text-gray-900 text-xl">{stop.name}</h3>
        </div>

        {/* Schedule info - organized in a clean grid */}
        <div className="px-4 pb-4">
          {stop.meetTime ? (
            // First stop - show meet and depart times
            <div className="flex justify-center gap-4 text-center">
              <div className="flex-1">
                <div className="mb-1 text-gray-500 text-xs uppercase tracking-wider">
                  Meet
                </div>
                <div className="font-semibold text-gray-900 text-lg">
                  {stop.meetTime}
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-1 text-gray-500 text-xs uppercase tracking-wider">
                  Depart
                </div>
                <div className="font-semibold text-gray-900 text-lg">
                  {stop.departTime}
                </div>
              </div>
            </div>
          ) : isLast ? (
            // Last stop - only arrival time
            <div className="text-center">
              <div className="mb-1 text-gray-500 text-xs uppercase tracking-wider">
                Arrive
              </div>
              <div className="font-semibold text-gray-900 text-lg">
                {stop.arriveTime}
              </div>
            </div>
          ) : (
            // Middle stops - show arrive and depart times
            <div className="flex justify-center gap-4 text-center">
              <div className="flex-1">
                <div className="mb-1 text-gray-500 text-xs uppercase tracking-wider">
                  Arrive
                </div>
                <div className="font-semibold text-gray-900 text-lg">
                  {stop.arriveTime}
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-1 text-gray-500 text-xs uppercase tracking-wider">
                  Depart
                </div>
                <div className="font-semibold text-gray-900 text-lg">
                  {stop.departTime}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Distance Indicator (not for last stop) */}
      {!isLast && stop.distanceToNext && (
        <div
          className={`flex items-center justify-center transition-all duration-1000 ${
            isCurrentTransition ? "animate-pulse py-6" : "py-4"
          }`}
        >
          <div
            className={`flex items-center justify-center gap-3 rounded-2xl transition-all duration-1000 ${
              isCurrentTransition
                ? "w-full bg-brand-yellow px-8 py-5 shadow-2xl ring-4 ring-brand-yellow/50" // Currently running this leg
                : "rounded-full bg-transparent px-4 py-2"
            }`}
          >
            {isCurrentTransition && (
              <div className="flex items-center gap-2 font-bold text-black text-xs uppercase tracking-widest">
                <span>Running Now</span>
              </div>
            )}

            {/* Distance */}
            <span
              className={`font-bold transition-all ${
                isCurrentTransition
                  ? "text-2xl text-black"
                  : "font-semibold text-lg text-white"
              }`}
            >
              {stop.distanceToNext} km
            </span>

            {/* Arrow pointing down */}
            <div
              className={`transition-all ${
                isCurrentTransition
                  ? "text-3xl text-black"
                  : "text-white text-xl"
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
