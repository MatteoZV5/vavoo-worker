const ORIGIN = "https://vavoo.to";

export default {
  async fetch(request) {
    try {
      const incoming = new URL(request.url);

      if (incoming.pathname === "/__test") {
        return Response.json({
          ok: true,
          worker: "vavoo-worker-github",
          origin: ORIGIN
        });
      }

      if (incoming.pathname === "/__where") {
        return Response.json({
          ok: true,
          colo: request.cf?.colo || null,
          country: request.cf?.country || null,
          city: request.cf?.city || null,
          region: request.cf?.region || null,
          timezone: request.cf?.timezone || null
        });
      }

      const target = new URL(
        incoming.pathname + incoming.search,
        ORIGIN
      );

      const headers = new Headers(request.headers);

      headers.delete("host");
      headers.delete("cf-connecting-ip");
      headers.delete("cf-ipcountry");
      headers.delete("cf-ray");
      headers.delete("cf-visitor");
      headers.delete("x-forwarded-for");
      headers.delete("x-real-ip");

      const init = {
        method: request.method,
        headers,
        redirect: "manual"
      };

      if (request.method !== "GET" && request.method !== "HEAD") {
        init.body = request.body;
      }

      const upstream = await fetch(target.toString(), init);

      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.set("X-Vavoo-Worker", "1");

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders
      });
    } catch (err) {
      return Response.json(
        {
          ok: false,
          error: String(err)
        },
        { status: 502 }
      );
    }
  }
};
