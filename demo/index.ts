import homepage from "./index.html";
import { greet } from "./util.ts";

const server = Bun.serve({
  routes: {
    "/": homepage,
    "/api/hello/:name": (req) => {
      console.log("request", req.method, new URL(req.url).pathname);
      return Response.json({
        message: greet(req.params.name),
        bun: Bun.version,
      });
    },
  },
});

console.log("Bun " + Bun.version + " listening on " + server.url);
console.log(
  "semver ^1.0.0 satisfies 1.2.3:",
  Bun.semver.satisfies("1.2.3", "^1.0.0"),
);
