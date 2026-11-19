# Solid 2 SSR dashboard

A full-stack [Solid 2](https://docs.solidjs.com/) app on Bun, with no framework and no Vite in between: `Bun.serve`
streams the page, Bun bundles the script that hydrates it, and the data is in `bun:sqlite`.

```sh
bun install
bun dev
```

Every panel is one database query, slowed down on purpose (0.3 s to 2.2 s, `TAKES` in `src/api.ts`) so that you can
watch what happens. Each panel says who asked for its data: the server, or the browser.

## Try it

1. **Reload the page.** It is there at once, with a placeholder in each panel; the panels arrive one by one, in the
   same response, as their queries finish. The badge says "Server HTML" until the script has hydrated the page, which
   attaches to the markup and takes over its data without asking for it again.
2. **Pick another range.** Now the browser asks. The same panels show the same placeholders and fill in one by one,
   marked "Fetched by the browser".
3. **Add an order.** It is in the list before the server has answered, marked "saving…", and the summary dims: its
   numbers are about to change. When the server is done, the real row and the new numbers take over.
4. **Ship an order.** The same, on a row that is there already.

Reloading, or following a range link, while the panels are still arriving makes the server log
`[SSR_STREAM_ABANDONED]`: the browser dropped a page it was still being sent, and Solid stopped rendering it. That is
a note from Solid's development build, not an error.

## How

| What you saw                      | Solid 2                                                        | Where                   |
| --------------------------------- | -------------------------------------------------------------- | ----------------------- |
| Panels streaming in               | an async `createMemo` read under `<Loading>`, `renderToStream` | `App.tsx`, `server.tsx` |
| The page taking over              | `hydrate`                                                      | `client.tsx`            |
| Placeholders again on a new range | `<Loading on={days()}>`, `latest(days)` for the picked range   | `App.tsx`               |
| The row that is there at once     | `action` with `createOptimisticStore`                          | `App.tsx`               |
| The summary dimming               | `affects` in the action, `isPending` where it is read          | `App.tsx`               |

The components ask an `Api` from context and don't know where they run: on the server it is the database
(`src/db.ts`), in the page it is `fetch` to the server's JSON routes (`src/client.tsx`).

## Files

| File              | What it is                                                                        |
| ----------------- | --------------------------------------------------------------------------------- |
| `solid-plugin.ts` | A Bun plugin that compiles Solid's JSX with `@solidjs/compiler`, for either side. |
| `preload.ts`      | Registers it for the server (`bunfig.toml` preloads it).                          |
| `src/server.tsx`  | `Bun.serve`: the streamed page, the bundled client script, the JSON routes.       |
| `src/client.tsx`  | The page's entry: `hydrate`, and the `Api` over `fetch`.                          |
| `src/App.tsx`     | The document and its panels.                                                      |
| `src/api.ts`      | The types and the `Api` interface both sides implement.                           |
| `src/db.ts`       | The tables, a month of orders, and the queries.                                   |
