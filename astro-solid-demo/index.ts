import { dev } from "astro";

// What `astro dev` does, without the CLI. Telemetry would write its config under the home directory.
process.env.ASTRO_TELEMETRY_DISABLED = "1";
await dev({ root: process.cwd() });
