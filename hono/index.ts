import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();
app.use(logger());

app.get("/", (c) => c.text("Hello from Hono on Bun! Try /api/hello/you"));

app.get("/api/hello/:name", (c) =>
  c.json({ message: `Hello, ${c.req.param("name")}!`, bun: Bun.version }),
);

app.post("/api/echo", async (c) => c.json(await c.req.json(), 201));

app.notFound((c) => c.json({ error: `no route for ${c.req.path}` }, 404));

const server = Bun.serve({ fetch: app.fetch });
console.log(`Hono at ${server.url}`);
