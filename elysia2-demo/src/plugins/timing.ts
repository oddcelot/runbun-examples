import { Elysia } from "elysia";

const started = new WeakMap<Request, number>();
const ms = (request: Request) =>
  (performance.now() - (started.get(request) ?? performance.now())).toFixed(2);

// Lifecycle hooks, applied to every route of the app that uses this plugin ('global').
export const timing = new Elysia({ name: "timing" })
  .onRequest(({ request }) => {
    started.set(request, performance.now());
  })
  .onAfterHandle("global", ({ request, set }) => {
    set.headers["server-timing"] = `handler;dur=${ms(request)}`;
  })
  .onAfterResponse("global", ({ request }) => {
    console.log(
      `${request.method} ${new URL(request.url).pathname} ${ms(request)}ms`,
    );
  });
