import {
  action,
  createMemo,
  createSignal,
  Errored,
  For,
  Loading,
  refresh,
} from "solid-js";
import { addOrder, listOrders, PRODUCTS, toggleShipped } from "./orders.ts";
import "./styles.css";

// Start mode renders this component on the server and hydrates it in the page; the plugin owns the entries.
export default function App() {
  // Async data is a memo that returns a promise. The server calls listOrders directly, the page POSTs to it.
  const orders = createMemo(() => listOrders(), { name: "orders" });
  const total = createMemo(
    () => orders().reduce((sum, order) => sum + order.quantity, 0),
    { name: "items" },
  );
  const open = createMemo(
    () => orders().filter((order) => !order.shipped).length,
    { name: "open" },
  );

  // An action is one transaction: its writes and server calls show up together in Activity.
  const add = action(function* (product: string, quantity: number) {
    yield addOrder(product, quantity);
    refresh(orders);
  });
  const ship = action(function* (id: number) {
    yield toggleShipped(id);
    refresh(orders);
  });

  return (
    <main>
      <header>
        <h1>Solid Start + devtools</h1>
        <p class="hint">
          Open Solid's devtools with the grip at the bottom, or{" "}
          <kbd>Alt+Shift+D</kbd>. In the runbun playground they are the Devtools
          tab under the preview.
        </p>
      </header>

      <section class="card">
        <h2>Orders</h2>
        <Loading
          fallback={<p class="loading">Loading orders from the server…</p>}
        >
          <ul>
            <For each={orders()}>
              {(order) => (
                <li>
                  <span>
                    {order.quantity} × {order.product}
                  </span>
                  <button class="ghost" onClick={() => ship(order.id)}>
                    {order.shipped ? "Shipped" : "Ship it"}
                  </button>
                </li>
              )}
            </For>
          </ul>
          <p class="totals">
            {total()} items, {open()} still open
          </p>
        </Loading>
        <NewOrder onAdd={add} />
      </section>

      <Fuse />
    </main>
  );
}

function NewOrder(props: {
  onAdd: (product: string, quantity: number) => void;
}) {
  // Named signals show up by name in the devtools' reactivity graph.
  const [product, setProduct] = createSignal(PRODUCTS[0], { name: "product" });
  const [quantity, setQuantity] = createSignal(1, { name: "quantity" });
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onAdd(product(), quantity());
      }}
    >
      <select
        aria-label="Product"
        value={product()}
        onChange={(e) => setProduct(e.currentTarget.value)}
      >
        <For each={PRODUCTS}>{(name) => <option>{name}</option>}</For>
      </select>
      <input
        type="number"
        aria-label="Quantity"
        min="1"
        max="9"
        value={quantity()}
        onInput={(e) => setQuantity(Number(e.currentTarget.value) || 1)}
      />
      <button>Add order</button>
    </form>
  );
}

/** A button that fails on purpose, so Health has an entry; the boundary keeps the rest of the page working. */
function Fuse() {
  const [lit, setLit] = createSignal(false, { name: "fuse" });
  const status = createMemo(() => {
    if (lit())
      throw new Error("The fuse blew: thrown on purpose by the button");
    return "Quiet. The button below throws an error.";
  });
  return (
    <section class="card">
      <h2>Errors</h2>
      <Errored
        fallback={(error, reset) => (
          <p role="alert" class="error">
            {String(error())}{" "}
            <button
              class="ghost"
              onClick={() => {
                setLit(false);
                reset();
              }}
            >
              Reset
            </button>
          </p>
        )}
      >
        <p>{status()}</p>
        <button onClick={() => setLit(true)}>Throw an error</button>
      </Errored>
    </section>
  );
}
