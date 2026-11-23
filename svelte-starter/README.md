# Svelte + Vite

A [Svelte 5](https://svelte.dev/) app on the Vite dev server, to build on: one component using runes, and hot module
replacement, so a saved component is swapped in the running page without a reload.

```sh
bun install
bun dev
```

## Try it

1. Click the button a few times.
2. Open `src/App.svelte` and change the heading or a style. Save.
3. The page updates in place and the count stays: it lives in `src/counter.svelte.ts`, which the edit doesn't touch.
   A component's own `$state` starts over when the component is swapped.
