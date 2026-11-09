type Todo = { id: number; title: string; done: boolean };

const todos: Todo[] = [{ id: 1, title: "Try Bun.serve", done: true }];

const server = Bun.serve({
  routes: {
    "/": () => new Response("Hello from Bun.serve! Try /api/todos"),
    "/api/todos": {
      GET: () => Response.json(todos),
      POST: async (req) => {
        const { title } = (await req.json()) as { title: string };
        const todo = { id: todos.length + 1, title, done: false };
        todos.push(todo);
        return Response.json(todo, { status: 201 });
      },
    },
    "/api/todos/:id": (req) => {
      const todo = todos.find((t) => t.id === Number(req.params.id));
      return todo
        ? Response.json(todo)
        : new Response("Not found", { status: 404 });
    },
  },
  fetch: () => new Response("Not found", { status: 404 }),
});

console.log(`Listening on ${server.url}`);
