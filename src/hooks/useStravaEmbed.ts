import { useEffect } from "react";

export const useStravaEmbed = (isActive: boolean) => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    // Always try to initialize when the map tab becomes active
    // since the DOM elements get recreated each time
    try {
      // Initialize Strava embeds using their bootstrap function
      if (window.__STRAVA_EMBED_BOOTSTRAP__) {
        window.__STRAVA_EMBED_BOOTSTRAP__();
        console.debug("Strava embeds initialized successfully");
      }
    } catch (error) {
      console.error("Failed to initialize Strava embeds:", error);
    }
  }, [isActive]);
};
