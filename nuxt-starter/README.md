# Nuxt

A [Nuxt 4](https://nuxt.com/) app on its dev server, to build on: one page, with Vue's and Nuxt's APIs imported
where they're used, and hot module replacement.

```sh
bun install
bun dev
```

## Try it

1. Click the button a few times.
2. Open `app/app.vue` and change the heading or a style. Save.
3. The page updates in place and the count stays.

`package.json` swaps Rollup for its WebAssembly build (`@rollup/wasm-node`), which runs everywhere Rollup's native
binaries don't, such as the runbun playground; `nuxt.config.ts` says why it asks Nitro for a port.
