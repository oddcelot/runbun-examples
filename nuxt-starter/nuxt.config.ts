// Nitro's dev server runs in a worker thread that listens on a unix socket; the playground's threads reach each other
// over ports, so ask for one. With native Bun it doesn't matter.
process.env.NITRO_NO_UNIX_SOCKET = "1";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  telemetry: false,
});
