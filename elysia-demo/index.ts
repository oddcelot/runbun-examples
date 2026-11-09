import { Elysia, t } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello from Elysia")
  .get("/json", () => ({ framework: "elysia", runtime: Bun.version }))
  .get("/user/:id", ({ params }) => ({ id: params.id }))
  .post("/echo", ({ body }) => body, { body: t.Object({ name: t.String() }) })
  .listen(3000);

console.log(`Elysia running at ${app.server?.url}`);
