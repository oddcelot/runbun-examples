// A composable in app/composables/ is imported wherever it's used. useState keeps the list across pages, and is
// serialized from the server-rendered page into the browser's, so it starts the same on both.
export function useTodos() {
  const todos = useState("todos", () => [
    { id: 1, text: "Open Nuxt DevTools" },
    { id: 2, text: "Add a page in app/pages" },
  ]);
  const add = (text: string) =>
    todos.value.push({ id: todos.value.length + 1, text });
  return { todos, add };
}
