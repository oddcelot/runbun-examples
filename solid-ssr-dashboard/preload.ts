// Runs before the server (bunfig.toml), so every .tsx it imports is compiled for the server.
import { solid } from "./solid-plugin.ts";

Bun.plugin(solid("ssr"));
