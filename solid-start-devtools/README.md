# Solid Start + devtools

A [Solid 2](https://docs.solidjs.com/) app in the plugin's start mode: the page is rendered on the server and
hydrated in the browser, its data comes through `"use server"` functions, and Solid's devtools dock sits at the bottom
of the page.

```sh
bun install
bun dev
```

## Try it

Open the dock with the grip at the bottom center, or with Alt+Shift+D. In the runbun playground it is the Devtools tab
under the preview instead, always open. It has three views.

1. **Activity**: reload the page and find the `listOrders` call and the load it started. Click "Ship it" or "Add
   order": each is an action, with its server call, the write and the memos that re-ran because of it.
2. **Structure**: the components the app made (`App`, `NewOrder`, `Fuse`) as a tree, or its signals and memos as a graph:
   `orders`, `items` and `open` are memos, `product`, `quantity` and `fuse` are signals, all named in their options.
3. **Health**: press "Throw an error". The error boundary shows it and the page keeps working, and the dock lists the
   error with its source-mapped stack. "Reset" puts the page back.

Ctrl+K (⌘K) in the dock finds a component, signal or server function by name.

## How it works

- `@solidjs/vite-plugin` runs in start mode (`ssr`, `start`): it owns the server and browser entries, so the project
  has no `index.html` and no `main.tsx`; `src/App.tsx` is the whole app. With `devtools` and
  `@solidjs/start-devtools` installed, it mounts the dock itself.
- `serverFunctions` turns each function marked `"use server"` (in `src/orders.ts`) into a request: on the server it is
  called directly, in the browser it POSTs to the dev server. The "database" is an array in that server's memory.
- Async data is a memo that returns a promise, read under `<Loading>`. An action runs a server call and then
  `refresh`es the memo, which is what Activity shows as one step.

## Files

| File             | What it is                                                                     |
| ---------------- | ------------------------------------------------------------------------------ |
| `index.ts`       | Starts the Vite dev server                                                     |
| `vite.config.ts` | The Solid plugin in start mode                                                 |
| `runbun.json`    | On runbun.dev: keeps the project off the fast path, which starts no dev server |
| `src/App.tsx`    | The page: orders, the form, the button that throws                             |
| `src/orders.ts`  | The server functions and the data behind them                                  |
| `src/styles.css` | Styles                                                                         |
