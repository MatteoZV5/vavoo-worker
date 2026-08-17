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

      const target = new URL(
        incoming.pathname + incoming.search,
        ORIGIN
      );

      const headers = new Headers(request.headers);

      // Non inoltrare header specifici della richiesta verso Cloudflare.
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
