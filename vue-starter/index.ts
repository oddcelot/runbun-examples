// Starts the Vite dev server. vite.config.ts adds the Vue plugin, which also sets up hot replacement.
import { createServer } from "vite";

const server = await createServer({ server: { port: 5173 } });
await server.listen();
server.printUrls();
