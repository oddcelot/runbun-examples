import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export type Todo = { id: number; text: string; done: boolean };

export const useTodos = defineStore("todos", () => {
  const items = ref<Todo[]>([
    { id: 1, text: "Open Vue DevTools", done: false },
    { id: 2, text: "Edit a component", done: false },
  ]);
  const filter = ref<"all" | "open" | "done">("all");

  const remaining = computed(() => items.value.filter((t) => !t.done).length);
  const visible = computed(() =>
    items.value.filter((t) =>
      filter.value === "all"
        ? true
        : filter.value === "done"
          ? t.done
          : !t.done,
    ),
  );

  let nextId = 3;
  function add(text: string) {
    items.value.push({ id: nextId++, text, done: false });
  }
  function remove(id: number) {
    items.value = items.value.filter((t) => t.id !== id);
  }

  watch(remaining, (n) => console.log(`${n} left`));

  return { items, filter, remaining, visible, add, remove };
});
