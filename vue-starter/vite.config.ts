import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  // Vite finds Vue when the page first asks for it, optimizes it then and reloads the page. Listing it here has that
  // done before the page first loads.
  optimizeDeps: { include: ["vue"] },
});
