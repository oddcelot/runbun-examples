// Nitro's dev server runs in a worker thread that listens on a unix socket; the playground's threads reach each other
// over ports, so ask for one. With native Bun it doesn't matter.
process.env.NITRO_NO_UNIX_SOCKET = "1";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  // In the runbun playground they show in the Devtools tab under the preview.
  devtools: {
    enabled: true,
    // There the project, its terminal and the browser are one sandbox: no token to paste before the devtools write
    // files. Remove this where the dev server is reachable by others.
    disableAuthorization: true,
    // No anonymous usage statistics (the welcome page's checkbox, which the playground skips).
    telemetry: false,
  },
  telemetry: false,
});
