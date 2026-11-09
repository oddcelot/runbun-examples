import { Database } from "bun:sqlite";

// In memory; pass a file name ("notes.sqlite") to keep the data in the project.
const db = new Database(":memory:");
db.run(
  "CREATE TABLE notes (id INTEGER PRIMARY KEY, text TEXT NOT NULL, created TEXT DEFAULT CURRENT_TIMESTAMP)",
);

const insert = db.query<{ id: number }, [string]>(
  "INSERT INTO notes (text) VALUES (?) RETURNING id",
);
const all = db.query("SELECT * FROM notes ORDER BY id");
insert.get("Hello from bun:sqlite");

const server = Bun.serve({
  routes: {
    "/": () => Response.json(all.all()),
    "/add/:text": (req) => {
      const row = insert.get(decodeURIComponent(req.params.text));
      return Response.json({ added: row?.id, notes: all.all() });
    },
  },
});

console.log(`Notes at ${server.url} (add one with /add/<text>)`);
