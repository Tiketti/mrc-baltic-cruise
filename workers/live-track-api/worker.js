// This is a Cloudflare Worker that serves as an API for the Brewery Run website.
// It is used to store and retrieve the LiveTrack URL for the Brewery Run.

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Admin-Password",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "GET") {
      const url = await env.BREWERY_RUN_LIVETRACK.get("livetrack_url");
      const timestamp = await env.BREWERY_RUN_LIVETRACK.get(
        "livetrack_timestamp",
      );
      const isLive = await env.BREWERY_RUN_LIVETRACK.get("is_live");

      return new Response(
        JSON.stringify({
          url,
          timestamp,
          isLive: isLive === "true",
        }),
        {
          headers: corsHeaders,
        },
      );
    }

    if (request.method === "POST") {
      const password = request.headers.get("X-Admin-Password");

      if (password !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: corsHeaders,
        });
      }

      const { url, isLive } = await request.json();
      const timestamp = new Date().toISOString();

      // If URL is provided, update it
      if (url) {
        await env.BREWERY_RUN_LIVETRACK.put("livetrack_url", url);
      }

      // Always update timestamp and isLive status (timestamp tracks any update)
      await env.BREWERY_RUN_LIVETRACK.put("livetrack_timestamp", timestamp);
      await env.BREWERY_RUN_LIVETRACK.put("is_live", isLive ? "true" : "false");

      return new Response(JSON.stringify({ success: true }), {
        headers: corsHeaders,
      });
    }

    return new Response("Method not allowed", { status: 405 });
  },
};
