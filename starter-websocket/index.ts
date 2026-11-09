import homepage from "./index.html";

const server = Bun.serve({
  routes: { "/": homepage },
  fetch(req, server) {
    const name = new URL(req.url).searchParams.get("name") ?? "guest";
    if (server.upgrade(req, { data: { name } })) return;
    return new Response("Not found", { status: 404 });
  },
  websocket: {
    data: {} as { name: string },
    open(ws) {
      ws.subscribe("chat");
      server.publish("chat", `${ws.data.name} joined`);
    },
    message(ws, message) {
      server.publish("chat", `${ws.data.name}: ${message}`);
    },
    close(ws) {
      server.publish("chat", `${ws.data.name} left`);
    },
  },
});

console.log(`Chat at ${server.url}`);
