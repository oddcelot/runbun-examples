import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid()],
  // The compiled .rx files import the runtime, which Vite's scan of the sources doesn't see: without this it is
  // optimized after the page first loads, and the page reloads.
  optimizeDeps: { include: ["@reactivescript/runtime"] },
});
