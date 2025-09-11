import { breweryStops } from "../breweryData";
import { BreweryCard } from "../components/BreweryCard";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export const BreweryRun = () => {
  useDocumentTitle("Brewery Run 2025 | MRC Helsinki");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto max-w-md px-4 py-8">
        <h1 className="mb-8 text-center font-bold text-3xl tracking-wider">
          BREWERY RUN 2025
        </h1>

        <div className="space-y-0">
          {breweryStops.map((stop, index) => (
            <BreweryCard
              key={stop.id}
              stop={stop}
              isLast={index === breweryStops.length - 1}
            />
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            Total Distance:{" "}
            {breweryStops.reduce(
              (total, stop) => total + (stop.distanceToNext || 0),
              0,
            )}{" "}
            km
          </p>
          <p className="mt-2">Helsinki • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};
