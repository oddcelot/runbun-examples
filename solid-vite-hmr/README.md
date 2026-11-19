# Solid 2 + Vite

A [Solid 2](https://docs.solidjs.com/) app on the Vite dev server, to show hot module replacement: save a component
and it is swapped in the running page, with the page's state left as it was.

```sh
bun install
bun dev
```

## Try it

1. Click the counter a few times and add a note.
2. Open `src/Counter.tsx` and change `STEP`, or the button's label. Save.
3. The counter is replaced where it stands. The count, the notes and the "Page loaded at" time don't change: nothing
   was reloaded.
4. Change `--accent` in `src/styles.css`: the new colour applies in place too.
5. Now change `src/main.tsx`. The time moves and the count is back at 0: the entry file can't be hot-replaced, so Vite
   reloads the page.

## How it works

- `@solidjs/vite-plugin` compiles the JSX and wraps every component so that a new version of its module can take the
  old one's place (`solid-js/refresh`). No code in the app is there for it.
- State survives when it lives above the component you edit. Here `App.tsx` owns the count and the notes and hands
  them down as props, so `Counter.tsx` and `Notes.tsx` can be replaced freely. Editing `App.tsx` replaces `App`, and
  with it the state it owns.

## Files

| File                               | What it is                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| `index.ts`                         | Starts the Vite dev server                                                     |
| `vite.config.ts`                   | The Solid plugin                                                               |
| `runbun.json`                      | On runbun.dev: keeps the project off the fast path, which starts no dev server |
| `index.html`                       | The page; loads `src/main.tsx`                                                 |
| `src/main.tsx`                     | Renders `App` into the page                                                    |
| `src/App.tsx`                      | Owns the state, lays out the page                                              |
| `src/Counter.tsx`, `src/Notes.tsx` | The components to edit                                                         |
| `src/styles.css`                   | Styles, also replaced in place                                                 |
