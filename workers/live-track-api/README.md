# LiveTrack API Worker

Cloudflare Worker for managing LiveTrack URLs with timestamp-based expiration.

## First-Time Setup (~5 minutes)

### Step 1: Login to Cloudflare

```bash
cd workers/live-track-api
npx wrangler login
```

Opens your browser. Click "Allow" to authorize.

### Step 2: Find Your KV Namespace ID

**Via command line:**
```bash
npx wrangler kv namespace list
```

**Via dashboard:**
Go to https://dash.cloudflare.com/ → Workers & Pages → KV tab

**If you don't have one, create it:**
```bash
npx wrangler kv namespace create BREWERY_RUN_LIVETRACK
```

Copy the ID and update `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "BREWERY_RUN_LIVETRACK"
id = "your-actual-id-here"
```

### Step 3: Set Admin Password

```bash
npx wrangler secret put ADMIN_PASSWORD
```

Enter a secure password when prompted. Remember it - you'll need it in `/admin`.

### Step 4: Deploy

```bash
cd ../..  # Back to project root
pnpm worker:deploy
```

### Step 5: Test

Visit: `https://livetrack-api.perttu-468.workers.dev/api/livetrack`

Should return: `{"url":null,"timestamp":null}`

Success! 🎉

## Usage

```bash
# Deploy to production (updates live API)
pnpm worker:deploy

# Test locally (runs on localhost:8787)
pnpm worker:dev

# Stream production logs
pnpm worker:tail
```

## API Endpoints

### GET /api/livetrack

Returns the current LiveTrack URL, timestamp, and live status.

**Response:**
```json
{
  "url": "https://livetrack.garmin.com/session/...",
  "timestamp": "2025-10-09T12:00:00.000Z",
  "isLive": true
}
```

### POST /api/livetrack

Updates the LiveTrack URL and/or live status (requires authentication).

**Headers:**
- `X-Admin-Password`: Your admin password
- `Content-Type`: application/json

**Body:**
```json
{
  "url": "https://livetrack.garmin.com/session/...",
  "isLive": true
}
```

**Notes:**
- `url` is **optional** - if omitted, the existing URL is preserved
- `isLive` indicates whether the event is actively happening (controls the pulsing eye icon)
- Timestamp is automatically updated on every POST request

**Response:**
```json
{
  "success": true
}
```

**Example Use Cases:**

Starting event:
```json
{
  "url": "https://livetrack.garmin.com/session/abc123",
  "isLive": true
}
```

Finishing event (no need to re-send URL):
```json
{
  "isLive": false
}
```

## Notes

- The timestamp is automatically updated on every POST request (whether you're setting a URL or just toggling status)
- When `isLive` is `true`: Visitors see the Live tab with a pulsing eye icon and real-time tracking
- When `isLive` is `false`: Visitors see a "Event Finished" message (with timestamp) for 2 hours, then the Live tab disappears
- The 2-hour window is configured in the frontend as `EVENT_FINISHED_VISIBLE_HOURS`
- URLs/events older than 7 hours from last update are completely hidden (configured as `LIVE_TRACK_MAX_AGE_HOURS`)
- CORS is enabled for all origins

## Troubleshooting

**"Account ID not found"**  
→ Run `npx wrangler login` first

**"Namespace not found"**  
→ Check the ID in `wrangler.toml` matches `npx wrangler kv namespace list`

**"Unauthorized" when POSTing**  
→ Make sure `X-Admin-Password` header is set (the `/admin` page does this automatically)

**"Error: No account_id found"**  
→ Add `account_id = "..."` to `wrangler.toml` (find it at https://dash.cloudflare.com/)

