// Cloudflare Worker API endpoint for LiveTrack URL management
export const CLOUDFLARE_WORKER_URL =
  "https://livetrack-api.perttu-468.workers.dev/api/livetrack";

// Fallback static route image (used when no LiveTrack URL is set)
export const FALLBACK_MAP_URL = "/assets/brewery-run-route.png";

// Maximum age (in hours) for LiveTrack URL to be considered active
export const LIVE_TRACK_MAX_AGE_HOURS = 7;

// How long (in hours) to show "Event finished" message after event ends
export const EVENT_FINISHED_VISIBLE_HOURS = 2;
