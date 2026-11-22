# ReactiveScript: cascading selects

Three selects, country, state and city, each with options loaded from the one above: a port to
[ReactiveScript](https://github.com/solidjs/reactivescript) of a Solid 2 example built on `createMemo`, `createSignal`
with a function, `isPending` and `<Loading>`. Each of those is one form in `.rx`.

```sh
bun install
bun dev
```

## Try it

1. Wait for the first load, then pick a state: the city select fills in half a second, with its first city chosen.
2. Pick another country. The state and city selects grey out while the new states load, and the old choices stay on
   screen until they arrive.
3. Open `src/app.rx` and read `App`'s six lines:
   - `states = await getStates(country)` is a question, asked again whenever `country` changes. An answer to an older
     question is dropped, so picking fast never shows the wrong states.
   - `source city = cities[0] ?? ""` is a selection the user writes (`city := v`) and that resets to the first city
     whenever `cities` changes: Solid's `createSignal(() => …)`.
   - In `Select`, `pending? props.options` is true while the options are being asked again: Solid's `isPending`.
4. Remove the `errored fallback(e) { … }` around the selects. The compiler refuses it: a loader can fail, and every
   reader of it needs a boundary or a `catch`.

## How it works

- `@solidjs/vite-plugin` finds `@reactivescript/compiler` in the project and compiles `.rx` files with it.
- `import pure { … } from "./api"` declares loaders: functions the app calls with the reactive values it reads. The
  compiled module asks the app for them by name; `src/main.ts` hands them over with `createApp({ api })`.
- Solid's devtools are the dock at the bottom of the page (the grip at its center, or Alt+Shift+D): the components, the signals and memos the equations
  compile to, and what a change re-ran. `src/main.ts` wraps the app in `DevToolbar` from `@solidjs/start-devtools`.
- The language is experimental and follows Solid 2: expect it to change.

## Files

| File             | What it is                                                                     |
| ---------------- | ------------------------------------------------------------------------------ |
| `index.ts`       | Starts the Vite dev server                                                     |
| `vite.config.ts` | The Solid plugin, which compiles `.rx` too                                     |
| `runbun.json`    | On runbun.dev: keeps the project off the fast path, which starts no dev server |
| `index.html`     | The page; loads `src/main.ts`                                                  |
| `src/main.ts`    | Mounts the app, with the loaders from `src/api.ts`                             |
| `src/app.rx`     | `App` and a generic `Select`                                                   |
| `src/api.ts`     | A pretend server: countries, states and cities, half a second each             |
| `src/styles.css` | Styles                                                                         |
