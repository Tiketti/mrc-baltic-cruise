import { useEffect, useState } from "react";
import { CLOUDFLARE_WORKER_URL, FALLBACK_MAP_URL } from "../constants";

export const useLiveTrackUrl = () => {
  const [url, setUrl] = useState<string>(FALLBACK_MAP_URL);
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
          console.log("Using fallback static map");

          setLoading(false);

          return;
        }

        const data = await response.json();

        if (data.url) {
          setUrl(data.url);

          console.log("LiveTrack URL loaded from Cloudflare KV");
        } else {
          console.log("No LiveTrack URL set, using fallback");

          setUrl(FALLBACK_MAP_URL);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching LiveTrack URL:", error);

        setUrl(FALLBACK_MAP_URL);
        setLoading(false);
      }
    };

    fetchLiveTrackUrl();
  }, []);

  return { url, loading };
};
