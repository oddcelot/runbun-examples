import homepage from "./src/index.html";

const server = Bun.serve({
  routes: {
    // Bun bundles the page, its TSX and its CSS when it's first requested.
    "/": homepage,
    "/api/hello": () =>
      Response.json({ message: `Hello from Bun ${Bun.version}` }),
  },
});

console.log(`React app at ${server.url}`);
