# ReactiveScript

A small app in [ReactiveScript](https://github.com/solidjs/reactivescript): a language for reactive UIs that carries
Solid 2's reactive semantics as language semantics and checks them before the code runs. Its files are `.rx`; they
compile to plain Solid 2.

```sh
bun install
bun dev
```

## Try it

1. Click **Add** a few times, and change the step.
2. Open `src/app.rx`. Three kinds of names do the work: `source count := 0` is state, `doubled = count * 2` is an
   equation that is always true, and `count := count + step` is a write, allowed only in a handler or an `action`.
3. Break a rule: change `doubled = count * 2` to `doubled := count * 2`. The compiler refuses it, with the rule it
   enforces.
4. Break a type: add `label: string = count` below it. That one is TypeScript's error.
5. Rest the pointer on `parity`: its type is `"even" | "odd"`.

## How it works

- `@solidjs/vite-plugin` finds `@reactivescript/compiler` in the project and compiles `.rx` files with it, to the same
  code a Solid component compiles to. Nothing else in `vite.config.ts` is there for it.
- `@reactivescript/runtime` is the small layer the compiled code calls: `createApp` in `src/main.ts` mounts the default
  component of `src/app.rx`.
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
| `src/main.ts`    | Mounts the app                                                                 |
| `src/app.rx`     | The components: state, equations, actions and markup                           |
| `src/styles.css` | Styles                                                                         |
