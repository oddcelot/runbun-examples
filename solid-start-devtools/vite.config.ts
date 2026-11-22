import solid from "@solidjs/vite-plugin";
import { defineConfig } from "vite";

// Start mode owns the entries (no index.html, no main.tsx), and mounts Solid's devtools because
// @solidjs/start-devtools is installed. `serverFunctions` turns each "use server" function into a request.
export default defineConfig({
  plugins: [
    solid({ ssr: true, start: { devtools: true }, serverFunctions: true }),
  ],
});
