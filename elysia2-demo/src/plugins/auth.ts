import { Elysia, status, t } from "elysia";

// A named plugin: `name` dedupes it when several modules `.use()` it.
const tokens = new Map([
  ["ada-token", { name: "Ada", role: "admin" as const }],
  ["bob-token", { name: "Bob", role: "user" as const }],
]);

export const auth = new Elysia({ name: "auth" }).macro({
  // `{ auth: true }` on a route or guard: checks the header, then hands the handler a typed `user`
  auth: {
    headers: t.Object({ authorization: t.Optional(t.String()) }),
    derive({ headers }) {
      const user = tokens.get(
        headers.authorization?.replace(/^Bearer /, "") ?? "",
      );
      return user
        ? { user }
        : status(401, "Send Authorization: Bearer ada-token");
    },
  },
  // `{ role: "admin" }`: a macro that takes an argument
  role: (role: "admin" | "user") => ({
    beforeHandle({ headers }) {
      const user = tokens.get(
        headers.authorization?.replace(/^Bearer /, "") ?? "",
      );
      if (user?.role !== role) return status(403, `Needs role ${role}`);
    },
  }),
});
