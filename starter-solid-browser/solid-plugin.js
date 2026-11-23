import { readFile } from "node:fs/promises";
import { transformAsync } from "@babel/core";
import solid from "@solidjs/babel-plugin";

export default {
  name: "solid-jsx",
  setup(build) {
    build.onLoad({ filter: /\.jsx$/ }, async ({ path }) => {
      const result = await transformAsync(await readFile(path, "utf8"), {
        filename: path,
        babelrc: false,
        configFile: false,
        sourceMaps: "inline",
        plugins: [[solid, { generate: "dom", moduleName: "@solidjs/web" }]],
      });
      return { contents: result.code, loader: "js" };
    });
  },
};
