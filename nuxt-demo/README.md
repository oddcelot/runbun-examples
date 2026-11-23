# Nuxt + DevTools

A small [Nuxt 4](https://nuxt.com/) app: two file-based pages, a todo list in an auto-imported composable over
`useState` that both pages share, an auto-imported component, and [Nuxt DevTools](https://devtools.nuxt.com/).

```sh
bun install
bun dev
```

## Try it

1. Add a todo, then open About: it counts the same list. The page view count in the corner is another `useState`.
2. Open Nuxt DevTools: the Nuxt button at the bottom of the page, or Alt+Shift+D. In the runbun playground they are in
   the Devtools tab under the preview instead. See the pages, the components, and the imports Nuxt adds.
3. Edit `app/components/TodoList.vue` and save: it is swapped in place, and the todos stay.

`package.json` swaps Rollup for its WebAssembly build (`@rollup/wasm-node`), which runs everywhere Rollup's native
binaries don't, such as the runbun playground; `nuxt.config.ts` says why it asks Nitro for a port, and why the
devtools skip their authorization step there.
