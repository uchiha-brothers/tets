export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "Only GET requests allowed" }, null, 2), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const instagramUrl = url.searchParams.get("url");

    if (!instagramUrl) {
      return new Response(JSON.stringify({ error: "No Instagram URL provided" }, null, 2), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiUrl = `https://jerrycoder.oggyapi.workers.dev/insta?url=${encodeURIComponent(instagramUrl)}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Instagram API Error:", errorText);
        return new Response(
          JSON.stringify({ error: "Failed to fetch Instagram video", details: errorText }, null, 2),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const jsonData = await response.json();

      const customData = {
        status: "success 🟢",
        result: jsonData.data || [],
        join: "OGGY_WORKSHOP on Telegram",
        support: "@OGGY_WORKSHOP",
      };

      return new Response(JSON.stringify(customData, null, 2), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error("Fetch Error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch Instagram video", details: error.message }, null, 2),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
