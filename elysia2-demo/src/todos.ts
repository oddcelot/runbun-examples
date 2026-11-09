import { Elysia, status, t } from "elysia";
import { auth } from "./plugins/auth";

type Todo = { id: number; title: string; done: boolean };

// A plugin with its own prefix, named models and an in-memory store.
// Elysia 2 takes the hook (schema, macros) before the handler: (path, hook, handler).
export const todos = new Elysia({ name: "todos", prefix: "/todos" })
  .use(auth)
  .model({
    todo: t.Object({ id: t.Number(), title: t.String(), done: t.Boolean() }),
    newTodo: t.Object({ title: t.String({ minLength: 1, maxLength: 80 }) }),
  })
  .state("todos", [
    { id: 1, title: "Run Elysia in the browser", done: true },
  ] as Todo[])
  // query strings are coerced: ?done=true becomes a boolean
  .get(
    "/",
    { query: t.Object({ done: t.Optional(t.Boolean()) }) },
    ({ store, query }) =>
      store.todos.filter(
        (todo) => query.done === undefined || todo.done === query.done,
      ),
  )
  .get(
    "/:id",
    { params: t.Object({ id: t.Number() }) },
    ({ store, params }) =>
      store.todos.find((todo) => todo.id === params.id) ??
      status(404, "No such todo"),
  )
  // every route in the guard needs a token; the auth macro hands them `user`
  .guard({ auth: true }, (app) =>
    app
      .post(
        "/",
        { body: "newTodo", response: { 201: "todo" } },
        ({ store, body, user }) => {
          const todo = {
            id: store.todos.length + 1,
            title: `${body.title} (by ${user.name})`,
            done: false,
          };
          store.todos.push(todo);
          return status(201, todo);
        },
      )
      .patch(
        "/:id",
        { params: t.Object({ id: t.Number() }) },
        ({ store, params }) => {
          const todo = store.todos.find((todo) => todo.id === params.id);
          if (!todo) return status(404, "No such todo");
          todo.done = !todo.done;
          return todo;
        },
      )
      .delete("/", { role: "admin" }, ({ store }) => ({
        removed: store.todos.splice(0).length,
      })),
  );
