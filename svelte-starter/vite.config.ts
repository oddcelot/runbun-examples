import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte()],
  // Vite finds Svelte when the page first asks for it, optimizes it then and reloads the page. Listing it here has
  // that done before the page first loads.
  optimizeDeps: { include: ["svelte"] },
});
