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

      return new Response(JSON.stringify({ url }), { headers: corsHeaders });
    }

    if (request.method === "POST") {
      const password = request.headers.get("X-Admin-Password");

      if (password !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: corsHeaders,
        });
      }

      const { url } = await request.json();

      await env.BREWERY_RUN_LIVETRACK.put("livetrack_url", url);

      return new Response(JSON.stringify({ success: true }), {
        headers: corsHeaders,
      });
    }

    return new Response("Method not allowed", { status: 405 });
  },
};
