// Starts the Vite dev server. vite.config.ts adds the Solid plugin, which finds @reactivescript/compiler and compiles
// the .rx files with it.
import { createServer } from "vite";

const server = await createServer({ server: { port: 5173 } });
await server.listen();
server.printUrls();
