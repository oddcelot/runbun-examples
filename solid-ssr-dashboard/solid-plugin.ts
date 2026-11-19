import { readFileSync } from "node:fs";
import { transform } from "@solidjs/compiler";
import type { BunPlugin } from "bun";

/**
 * Compiles Solid's JSX. The same components are compiled twice: to HTML
 * strings for the server ("ssr") and to DOM code that picks up the server's
 * markup for the page ("dom").
 */
export const solid = (generate: "ssr" | "dom"): BunPlugin => ({
  name: `solid-${generate}`,
  setup(build) {
    build.onLoad({ filter: /\.tsx$/ }, ({ path }) => {
      const { code } = transform(readFileSync(path, "utf8"), {
        filename: path,
        generate,
        hydratable: true,
      });
      // Only the JSX is compiled; Bun strips the types that are left.
      return { contents: code, loader: "ts" };
    });
  },
});
