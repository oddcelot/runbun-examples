import { DevToolbar } from "@solidjs/start-devtools";
import { hydrate } from "@solidjs/web";
import { ApiContext, apiOf, rangeOf } from "./api.ts";
import { App } from "./App.tsx";

const request = async (path: string, method = "GET", body?: unknown) => {
  const response = await fetch(path, { method, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`${method} ${path}: ${response.status}`);
  return response.json();
};

// The page's side of the interface: the JSON routes in server.tsx.
const api = apiOf(
  {
    summary: (days) => request(`api/summary?days=${days}`),
    daily: (days) => request(`api/daily?days=${days}`),
    products: (days) => request(`api/products?days=${days}`),
    orders: () => request("api/orders"),
    ship: (id) => request(`api/orders/${id}/ship`, "POST"),
    place: (order) => request("api/orders", "POST", order),
  },
  "browser",
);

// Attaches to the markup the server sent, instead of rendering it again.
hydrate(
  () => (
    <ApiContext value={api}>
      <DevToolbar>
        <App days={rangeOf(location.href)} />
      </DevToolbar>
    </ApiContext>
  ),
  document,
);
