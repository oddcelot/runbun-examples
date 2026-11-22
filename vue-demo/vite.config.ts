import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  // vueDevTools adds Vue DevTools to the page: the floating Vue button, or Alt+Shift+D, opens them.
  plugins: [vue(), vueDevTools()],
  // Vite finds Vue and Pinia when the page first asks for them, optimizes them then and reloads the page. Listing them
  // here has that done before the page first loads.
  optimizeDeps: { include: ["vue", "pinia"] },
});
