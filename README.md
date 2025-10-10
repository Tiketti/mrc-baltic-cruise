# MRC Baltic Cruise 2025 mobile program

[![Netlify Status](https://api.netlify.com/api/v1/badges/a7fc3283-42c3-45ca-a04a-9a585ad71f32/deploy-status)](https://app.netlify.com/sites/mrcbalticcruise/deploys)
[![E2E Tests](https://github.com/Tiketti/mrc-baltic-cruise/actions/workflows/playwright.yml/badge.svg)](https://github.com/Tiketti/mrc-baltic-cruise/actions/workflows/playwright.yml)

This project contains multiple MRC event sites:

- **Root (/)**: Landing page with links to all events
- **Baltic Cruise (/baltic-cruise)**: Archived 2025 Baltic Cruise site  
- **Brewery Run (/brewery-run)**: Helsinki brewery-to-brewery running event

## Brewery Run Features

The brewery run site includes:
- **Real-time timeline**: Shows current brewery location and running status
- **Smart highlighting**: Visual indicators based on current time
- **Mobile-first design**: Optimized for use during the event
- **Brand-consistent styling**: Uses Mikkeller design language

### Testing Time-Based Highlighting

Use the `mockTime` query parameter to test the time-based highlighting:

```
/brewery-run?mockTime=12:30  # At Masis Brewery
/brewery-run?mockTime=13:00  # Running to Solmu  
/brewery-run?mockTime=13:45  # At Solmu Brewery
/brewery-run?mockTime=14:15  # Running to Salamanation
```

Format: `HH:MM` (24-hour format, no seconds needed)

### Live Track System Architecture

The brewery run includes a dynamic live tracking system powered by Cloudflare Workers and KV storage:

```mermaid
sequenceDiagram
    participant Runner as 🏃 Runner
    participant Watch as Garmin Watch
    participant Email as Email
    participant Admin as /admin Page
    participant Worker as Cloudflare Worker
    participant KV as Cloudflare KV
    participant Map as Map Component
    participant Users as 👥 Event Followers

    Note over Runner,Watch: Day of Event
    Runner->>Watch: Start LiveTrack
    Watch->>Email: Send LiveTrack URL
    Email->>Runner: Receive link
    
    Note over Runner,Admin: Update System (< 2 min)
    Runner->>Admin: Open /admin
    Runner->>Admin: Paste LiveTrack URL + Password
    Admin->>Worker: POST /api/livetrack<br/>{url, X-Admin-Password}
    Worker->>Worker: Verify password
    Worker->>KV: Store URL
    Worker->>Admin: Success ✅
    Admin->>Admin: Show toast notification
    
    Note over Map,Users: Live Tracking Active
    loop Every page load
        Users->>Map: Visit /brewery-run#map
        Map->>Worker: GET /api/livetrack
        Worker->>KV: Fetch URL
        KV->>Worker: Return URL
        Worker->>Map: {url: "garmin.com/..."}
        Map->>Map: Render iframe with live map
        Map->>Users: Display real-time location 🗺️
    end
```

**Key Components:**

- **Admin Dashboard** (`/admin`): Mobile-friendly interface for updating the LiveTrack URL on-the-fly
- **Cloudflare Worker**: Serverless API endpoint that handles GET/POST requests
- **Cloudflare KV**: Persistent key-value storage for the LiveTrack URL
- **Map Component**: Fetches URL from Worker and displays live tracking iframe
- **Security**: Password-protected POST endpoint (via `X-Admin-Password` header)

**Workflow:**
1. Runner starts Garmin LiveTrack and receives email with unique session URL
2. Runner opens `/admin` on phone, pastes URL, checks "Event is active", enters password
3. Worker validates password and stores URL + live status + timestamp in KV
4. All users visiting the site see a "Live" tab with a pulsing red eye icon 👁️
5. When run finishes, runner unchecks "Event is active" (no need to re-paste URL!)
6. Users see "Live" tab without the pulsing eye (can check if group is still at final venue)
7. After 7 hours from last update, the "Live" tab auto-hides
8. No backend, no database, no complex infrastructure needed

**Using the Admin Dashboard:**

The admin interface (`/admin`) supports two operations:

**Starting the Event:**
1. Navigate to `https://mikkellerrunning.club/admin`
2. Paste the Garmin LiveTrack URL from your email
3. Check "Event is currently active"
4. Enter the admin password
5. Click "Update LiveTrack URL"
6. Visitors now see the "Live" tab with a pulsing red eye 👁️ indicating active tracking

**Finishing the Event:**
1. Navigate to `https://mikkellerrunning.club/admin`
2. **Leave URL field empty** (no need to re-enter!)
3. Uncheck "Event is currently active"
4. Enter the admin password
5. Click "Update LiveTrack URL"
6. Visitors see the "Live" tab WITHOUT the pulsing eye (frozen at last location)

**Design Choices:**

- **Pulsing Eye Icon**: Appears only when "Event is active" is checked, signaling to visitors that people are actively running right now
- **Live Tab Persistence**: After unchecking "Event is active", the Live tab remains visible for up to 7 hours so visitors can check if the group is still at the final brewery
- **Timestamp Reset**: The 7-hour countdown resets with every admin update, so if you toggle the status at 6pm, the tab stays visible until 1am
- **Optional URL Field**: When just updating the event status, you can leave the URL field empty - the system keeps the existing URL
- **Three Tab States**: 
  - Schedule + Route only (before event)
  - Schedule + Route + Live with 👁️ (event active)
  - Schedule + Route + Live without 👁️ (event finished, < 7h ago)

**Visitor Experience:**

The map section adapts to event status:

- **Before event starts**: Only "Schedule" and "Route" tabs visible
- **Event is live** (actively running): "Live" tab appears with pulsing red eye icon - location updates in real-time
- **Event finished** (< 7 hours ago): "Live" tab visible without pulsing eye - shows last known location (useful if group is still drinking at final venue)
- **Event ended** (> 7 hours ago): "Live" tab disappears, back to "Schedule" and "Route" only

**Fallback Behavior:**

The system gracefully handles errors and missing data:

- **Before LiveTrack URL is set**: Displays a static route map (Garmin Connect course)
- **If Worker is unreachable**: Falls back to static route map
- **If KV fetch fails**: Falls back to static route map
- **Invalid password**: Shows error toast, does not update URL
- **Ended LiveTrack session**: After 7 hours, automatically reverts to static route map

This ensures users always see *something* useful on the map tab, even if live tracking isn't active yet or if there's a network issue. The fallback URL is defined in `src/constants.ts` and can be easily updated to any route planning service (Strava, Komoot, etc.).

### Deploying the Cloudflare Worker

The LiveTrack API runs as a Cloudflare Worker. Here's how to deploy and manage it:

**🔧 Installation: npx vs Homebrew**

We use `npx wrangler@latest` which downloads wrangler on-demand - **no installation required**. This means:
- ✅ Always uses the latest version
- ✅ No global dependencies cluttering your system  
- ✅ Works immediately without setup
- ✅ Different projects can use different wrangler versions

If you prefer a global install via Homebrew:
```bash
brew install cloudflare-wrangler2
# Then remove 'npx' from the scripts and just use 'wrangler'
```

**📦 Available Scripts**

```bash
# Deploy worker to production (updates the live API)
pnpm worker:deploy

# Run worker locally for testing (creates local dev server)
pnpm worker:dev

# Stream live logs from production (useful for debugging)
pnpm worker:tail
```

**🤔 Deploy vs Dev - What's the Difference?**

- **`pnpm worker:deploy`**: Deploys your worker code to Cloudflare's global network. This updates the actual production API at `livetrack-api.perttu-468.workers.dev`. Use this when you've made changes and want to push them live. Takes ~10 seconds.

- **`pnpm worker:dev`**: Runs the worker on your local machine (usually `localhost:8787`) for testing. Changes are instant, and you can test without affecting production. Use this when developing/debugging. The local version uses `.dev.vars` for secrets instead of Cloudflare's secret storage.

- **`pnpm worker:tail`**: Doesn't change anything - just shows you real-time logs from production. Like `console.log` streaming from the cloud. Great for watching what happens when users hit the API.

**📚 Detailed Setup Instructions**

See the [LiveTrack API Worker README](./workers/live-track-api/README.md) for complete setup (~5 minutes) and API reference.

**Quick Deploy Checklist:**
1. Make changes to `workers/live-track-api/worker.js`
2. Test locally: `pnpm worker:dev`
3. Deploy to production: `pnpm worker:deploy`
4. Monitor if needed: `pnpm worker:tail`

## Temporarily Hidden Features

For the focused brewery run launch, the following features are commented out but easily restorable:

- **Navigation component** (in `App.tsx`)
- **Map tab functionality** (in `BreweryRun.tsx`)
- **Tab switching UI** (in `BreweryRun.tsx`)

To restore: uncomment the relevant sections and add back the `useState` import.

![Cruise Map](./public/assets/mrc_cruise_map.svg)
