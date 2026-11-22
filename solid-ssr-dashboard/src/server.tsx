import { DevToolbar } from "@solidjs/start-devtools";
import { renderToStream } from "@solidjs/web";
import { solid } from "../solid-plugin.ts";
import { ApiContext, apiOf, rangeOf } from "./api.ts";
import { App } from "./App.tsx";
import { queries } from "./db.ts";

const api = apiOf(queries, "server");

const server = Bun.serve({
  routes: {
    // The document goes out as a stream: first the page with a placeholder
    // in each panel, then every panel's markup and data as its query ends.
    "/": (request) => {
      const stream = renderToStream(() => (
        <ApiContext value={api}>
          {/* Solid's devtools dock. It is on both sides, so the markup matches when the page hydrates. */}
          <DevToolbar>
            <App days={rangeOf(request.url)} />
          </DevToolbar>
        </ApiContext>
      ));
      const { readable, writable } = new TransformStream<Uint8Array>();
      const writer = writable.getWriter();
      writer.write(new TextEncoder().encode("<!doctype html>"));
      writer.releaseLock();
      stream.pipeTo(writable);
      return new Response(readable, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    },

    // The page's script: the same components, compiled for the DOM and
    // bundled by Bun. Built when asked for, so a reload has your edits.
    "/client.js": async () => {
      const build = await Bun.build({
        entrypoints: [`${import.meta.dir}/client.tsx`],
        target: "browser",
        // Solid's development build, which the devtools read; without it the dock has nothing to show.
        conditions: ["development"],
        plugins: [solid("dom")],
      });
      return new Response(build.outputs[0]);
    },
    "/styles.css": () =>
      new Response(Bun.file(`${import.meta.dir}/styles.css`)),

    // What the page asks once it is running: the same queries, as JSON.
    "/api/summary": async (request) =>
      Response.json(await queries.summary(rangeOf(request.url))),
    "/api/daily": async (request) =>
      Response.json(await queries.daily(rangeOf(request.url))),
    "/api/products": async (request) =>
      Response.json(await queries.products(rangeOf(request.url))),
    "/api/orders": {
      GET: async () => Response.json(await queries.orders()),
      POST: async (request) =>
        Response.json((await queries.place(await request.json())) ?? null),
    },
    "/api/orders/:id/ship": {
      POST: async (request) =>
        Response.json((await queries.ship(Number(request.params.id))) ?? null),
    },
  },
});

console.log(`Dashboard at ${server.url}`);
