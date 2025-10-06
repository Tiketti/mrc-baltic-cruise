/// <reference types="vite/client" />

declare global {
  interface Window {
    __STRAVA_EMBED_BOOTSTRAP__?: () => void;
  }
}

export {};
