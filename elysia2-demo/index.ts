import { Elysia, redirect, sse, status, t } from "elysia";
import { websocket } from "elysia/websocket";
import { auth } from "./src/plugins/auth";
import { timing } from "./src/plugins/timing";
import { todos } from "./src/todos";

class TeapotError extends Error {}

const app = new Elysia()
  .use(websocket()) // Elysia 2: .ws() needs the WebSocket capability
  .use(timing)
  .use(auth)
  .use(todos)
  // an error handler by class (failed validation already answers 422 application/problem+json)
  .onError(TeapotError, ({ error }) => status(418, { error: error.message }))
  // a page that uses the routes below (Elysia sends a BunFile with its type)
  .get("/", () => Bun.file(new URL("./src/index.html", import.meta.url)))
  .get("/info", () => ({
    framework: "elysia 2",
    runtime: `bun ${Bun.version}`,
  }))
  .get("/me", { auth: true }, ({ user }) => user)
  // cookies: typed, validated and written back as Set-Cookie
  .get(
    "/visits",
    { cookie: t.Cookie({ visits: t.Optional(t.Number()) }) },
    ({ cookie: { visits } }) => {
      visits.value = (visits.value ?? 0) + 1;
      visits.httpOnly = true;
      return `Visit number ${visits.value}`;
    },
  )
  // server-sent events from an async generator
  .get("/count", async function* () {
    for (let i = 1; i <= 5; i++) {
      yield sse({ event: "tick", data: { i } });
      await Bun.sleep(200);
    }
  })
  .get("/teapot", () => {
    throw new TeapotError("I'm a teapot");
  })
  .get("/home", () => redirect("/"))
  // WebSocket chat room: validated messages, pub/sub
  .ws(
    "/chat",
    {
      body: t.Object({ text: t.String({ maxLength: 200 }) }),
      query: t.Object({ name: t.String({ default: "anon" }) }),
      open(ws) {
        ws.subscribe("room");
        ws.publish("room", { from: "server", text: `${ws.query.name} joined` });
      },
    },
    (ws, { text }) => {
      ws.publish("room", { from: ws.query.name, text });
      ws.send({ from: "you", text });
    },
  )
  .listen(3000);

console.log(`Elysia running at ${app.server?.url}`);
