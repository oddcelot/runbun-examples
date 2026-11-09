# runbun.dev examples

The starters and examples in the project gallery of [runbun.dev](https://runbun.dev), the Bun playground that runs in
the browser. Each folder is one project; `https://runbun.dev/?example=<folder>` opens it.

The playground bakes this repo in when it is built, so a merged change shows up on runbun.dev with its next deploy.

## Adding a project

1. Make a folder named like the project, lowercase with dashes (`hono-jsx`, `starter-cli`). The name is its
   `?example=` link, so it doesn't change once merged.
2. Put the project in it: a `package.json` and its files, as `bun init` would lay them out. The playground runs the
   `dev` script if there is one, else the `module` (or `main`) file, else `index.ts`. Keep it small: no `node_modules`,
   no build output. A `bun.lock` is welcome when versions matter.
3. Add an `example.json` (see [example.schema.json](example.schema.json)):

   ```json
   {
     "$schema": "../example.schema.json",
     "name": "Hono JSX",
     "description": "Server-rendered pages with hono/jsx",
     "kind": "example",
     "tags": ["Hono"]
   }
   ```

   - `kind`: `starter` for a small project to build on, `example` for one that shows a framework or feature.
   - `tags`: the frameworks and libraries it is built on (React, Elysia, SQLite), not Bun's own APIs such as
     Bun.serve. The gallery filters by them, and the first one it has a logo for becomes the card's icon. A tag without
     a logo shows without one; say in the pull request if it needs one.
   - `order` (optional): where it sits among its kind, lower first.
   - `repo` (instead of files): a public GitHub repo to open, for a project that lives elsewhere. The folder then holds
     only `example.json`. The playground fetches it when picked, so it counts against GitHub's rate limit.
4. Check it: `bun scripts/check.ts <folder>` validates `example.json`, checks that `bun fmt` leaves the files as they
   are (`--write` formats them), and installs and starts the project with Bun. CI runs the same on every pull request.
5. Try it in the browser, where it has to work too: the playground runs Bun's own code compiled to WebAssembly, and
   some things (child processes, native addons, install scripts) don't run there. See
   [what works](https://docs.runbun.dev/compatibility/). Open a pull request; runbun.dev's own checks run every
   project in the browser before a new version of this repo ships.

## Layout

```
<folder>/
  example.json   how the gallery shows it
  package.json   the project (absent for a repo entry)
  …
scripts/check.ts what CI runs
```
