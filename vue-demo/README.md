# Vue + Pinia + DevTools

A todo list in [Vue 3](https://vuejs.org/): components that talk through props and events, a
[Pinia](https://pinia.vuejs.org/) store with `computed` and `watch`, and
[Vue DevTools](https://devtools.vuejs.org/) on the Vite dev server.

```sh
bun install
bun dev
```

## Try it

1. Add a todo, tick one, and switch between all, open and done.
2. Open Vue DevTools: the floating Vue button at the bottom of the page, or Alt+Shift+D. In the runbun playground they
   are in the Devtools tab under the preview instead. Pick `<TodoItem>` in the component tree and see its props, or
   the Pinia tab for the store's state.
3. Edit `src/components/TodoItem.vue` and save: it is swapped in place, and the todos stay.
4. `watch` in `src/stores/todos.ts` logs how many are left each time that changes.
