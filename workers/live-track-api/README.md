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

Returns the current LiveTrack URL and timestamp.

**Response:**
```json
{
  "url": "https://livetrack.garmin.com/session/...",
  "timestamp": "2025-10-09T12:00:00.000Z"
}
```

### POST /api/livetrack

Sets a new LiveTrack URL (requires authentication).

**Headers:**
- `X-Admin-Password`: Your admin password
- `Content-Type`: application/json

**Body:**
```json
{
  "url": "https://livetrack.garmin.com/session/..."
}
```

**Response:**
```json
{
  "success": true
}
```

## Notes

- The timestamp is automatically set when updating the URL
- URLs older than 7 hours are considered expired (configured in frontend)
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

