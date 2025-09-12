import { useStravaEmbed } from "../hooks/useStravaEmbed";

export const MapTab = () => {
  // Initialize Strava embed when this component is mounted
  useStravaEmbed(true);

  return (
    <div className="space-y-4">
      {/* Map Section */}
      <div className="rounded-lg bg-gray-800 p-4">
        <h2 className="mb-4 font-semibold text-lg">Route Map</h2>

        {/* Strava Embed */}
        <div className="overflow-hidden rounded bg-gray-700">
          <div
            className="strava-embed-placeholder"
            data-embed-type="route"
            data-embed-id="3400850951821096492"
            data-units="metric"
            data-full-width="true"
            data-style="standard"
            data-map-hash="9.27/60.1737/24.8902"
            data-from-embed="true"
          >
            {/* Fallback content while Strava loads */}
            <div className="flex h-64 items-center justify-center text-gray-400">
              <div className="text-center">
                <p>Loading route map...</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-2 text-gray-400 text-sm">Placeholder route.</p>
      </div>
    </div>
  );
};
