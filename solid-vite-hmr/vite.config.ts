import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid()],
  // Vite's scan finds the devtools in src/main.tsx, but in the playground it optimizes them only once the page has
  // loaded, and the page reloads. Listing them here has that done before the page first loads.
  optimizeDeps: { include: ["@solidjs/start-devtools"] },
});
