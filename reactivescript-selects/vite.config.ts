import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid()],
  // The compiled .rx files import the runtime, and src/main.ts the devtools. Vite's scan of the sources doesn't see the
  // first (and the playground optimizes the second late): without this they are optimized after the page first
  // loads, and the page reloads.
  optimizeDeps: {
    include: ["@reactivescript/runtime", "@solidjs/start-devtools"],
  },
});
