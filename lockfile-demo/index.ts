import stringWidth from "string-width";
import kleur from "kleur";

// strip-ansi@6 (CommonJS, never imported) sits at the top level, so Bun nests strip-ansi@7 and
// ansi-regex@6 under string-width. Getting 13 here means the nested copies were resolved.
kleur.enabled = true;
const fancy = kleur.bold().green("héllo 👋 世界");
const width = stringWidth(fancy);
console.log("width:", width);

Bun.serve({
  fetch: () =>
    new Response(`<h1 id="w">width=${width}</h1>`, {
      headers: { "content-type": "text/html" },
    }),
});
