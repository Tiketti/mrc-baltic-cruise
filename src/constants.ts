// Cloudflare Worker API endpoint for LiveTrack URL management
export const CLOUDFLARE_WORKER_URL =
  "https://livetrack-api.perttu-468.workers.dev/api/livetrack";

// Fallback static map URL (used when no LiveTrack URL is set)
export const FALLBACK_MAP_URL =
  "https://connect.garmin.com/modern/course/embed/409837108";

// Maximum age (in hours) for LiveTrack URL to be considered active
export const LIVE_TRACK_MAX_AGE_HOURS = 7;
