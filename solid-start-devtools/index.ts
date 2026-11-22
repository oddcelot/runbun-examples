// Starts the Vite dev server. In start mode the plugin owns the entries (no index.html, no main.tsx).
import { createServer } from "vite";

const server = await createServer({ server: { port: 5173 } });
await server.listen();
server.printUrls();
