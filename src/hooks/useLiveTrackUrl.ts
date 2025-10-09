import { useEffect, useState } from "react";
import {
  CLOUDFLARE_WORKER_URL,
  FALLBACK_MAP_URL,
  LIVE_TRACK_MAX_AGE_HOURS,
} from "../constants";

export const useLiveTrackUrl = () => {
  const [url, setUrl] = useState<string>(FALLBACK_MAP_URL);
  const [liveTrackUrl, setLiveTrackUrl] = useState<string | null>(null);
  const [isLiveTrackRecent, setIsLiveTrackRecent] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveTrackUrl = async () => {
      try {
        const response = await fetch(CLOUDFLARE_WORKER_URL);

        if (!response.ok) {
          console.warn(
            "Failed to fetch LiveTrack URL, using fallback static map",
          );
          setUrl(FALLBACK_MAP_URL);
          setLiveTrackUrl(null);
          setIsLiveTrackRecent(false);
          setIsLive(false);
          setLoading(false);

          return;
        }

        const data = await response.json();
        const eventIsLive = data.isLive === true;

        if (data.url && data.timestamp) {
          const timestamp = new Date(data.timestamp);
          const now = new Date();
          const hoursSinceUpdate =
            (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

          if (hoursSinceUpdate < LIVE_TRACK_MAX_AGE_HOURS) {
            // Recent LiveTrack URL - use it and make it available for tabs
            setUrl(data.url);
            setLiveTrackUrl(data.url);
            setIsLiveTrackRecent(true);
            setIsLive(eventIsLive);
            console.log(
              `LiveTrack URL is recent (${hoursSinceUpdate.toFixed(1)} hours old), live: ${eventIsLive}`,
            );
          } else {
            // Old LiveTrack URL - use fallback but keep the live track URL available
            setUrl(FALLBACK_MAP_URL);
            setLiveTrackUrl(data.url);
            setIsLiveTrackRecent(false);
            setIsLive(false);
            console.log(
              `LiveTrack URL is too old (${hoursSinceUpdate.toFixed(1)} hours), using fallback`,
            );
          }
        } else if (data.url) {
          // URL exists but no timestamp - treat as valid for backwards compatibility
          setUrl(data.url);
          setLiveTrackUrl(data.url);
          setIsLiveTrackRecent(true);
          setIsLive(eventIsLive);
          console.log("LiveTrack URL loaded (no timestamp)");
        } else {
          console.log("No LiveTrack URL set, using fallback");
          setUrl(FALLBACK_MAP_URL);
          setLiveTrackUrl(null);
          setIsLiveTrackRecent(false);
          setIsLive(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching LiveTrack URL:", error);

        setUrl(FALLBACK_MAP_URL);
        setLiveTrackUrl(null);
        setIsLiveTrackRecent(false);
        setIsLive(false);
        setLoading(false);
      }
    };

    fetchLiveTrackUrl();
  }, []);

  return { url, liveTrackUrl, isLiveTrackRecent, isLive, loading };
};
