import { HydrationScript } from "@solidjs/web";
import type { JSX } from "@solidjs/web";
import {
  action,
  affects,
  createMemo,
  createOptimisticStore,
  createSignal,
  Errored,
  For,
  isPending,
  latest,
  Loading,
  onSettled,
  refresh,
  Show,
  useContext,
} from "solid-js";
import { ApiContext, MENU, RANGES, TAKES } from "./api.ts";
import type { Loaded, NewOrder, Order } from "./api.ts";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const money = (cents: number) => usd.format(cents / 100);

/** The whole document: the server streams it, the page hydrates it. */
export function App(props: { days: number }) {
  const api = useContext(ApiContext);

  // A signal that starts from the URL's range and that a click can set.
  const [days, setDays] = createSignal(() => props.days);

  // Async data is a memo that returns a promise. Each one is read under a
  // <Loading> boundary (in Panel), so the server sends the page at once and
  // streams every panel in when its query is done. The page then takes over
  // those answers: it does not ask again while it hydrates.
  const summary = createMemo(() => api.summary(days()));
  const daily = createMemo(() => api.daily(days()));
  const products = createMemo(() => api.products(days()));

  // The server's list, plus what a running action wrote on top of it.
  const [orders, setOrders] = createOptimisticStore<Order[]>(
    () => api.orders(),
    [],
  );

  // An action is one transaction. Its optimistic writes show at once, each
  // `yield` waits for the server, and when it is done they give way to what
  // the refreshed queries answer (or to the old list, if the server threw).
  const ship = action(function* (id: number) {
    setOrders((list) => {
      const order = list.find((order) => order.id === id);
      if (order) Object.assign(order, { shipped: true, saving: true });
    });
    affects(summary); // "To ship" is about to change: isPending below sees it.
    yield api.ship(id);
    refresh(orders);
    refresh(summary);
  });

  const place = action(function* (order: NewOrder) {
    const { price } = MENU.find((item) => item.name === order.product)!;
    setOrders((list) => {
      list.unshift({
        ...order,
        id: -Date.now(),
        total: price * order.quantity,
        shipped: false,
        saving: true,
      });
      list.length = Math.min(list.length, 6);
    });
    affects(summary);
    yield api.place(order);
    refresh(orders);
    refresh(summary);
  });

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    place({
      product: String(form.get("product")),
      quantity: Number(form.get("quantity")),
      // The slower panels catch up on their own time: a plain refresh
      // swaps the new answer in without a placeholder.
    }).then(() => {
      refresh(daily);
      refresh(products);
    });
  };

  const pick = (range: number, event: MouseEvent) => {
    event.preventDefault();
    history.replaceState(null, "", `?days=${range}`);
    setDays(range);
  };

  // Set once the page's script has attached to the server's markup.
  const [hydrated, setHydrated] = createSignal(false);
  onSettled(() => {
    setHydrated(true);
  });

  const peak = () => Math.max(...daily().data.map((day) => day.revenue));

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Solid 2 SSR dashboard</title>
        <link rel="icon" href="data:," />
        <link rel="stylesheet" href="styles.css" />
        <HydrationScript />
      </head>
      <body>
        <header>
          <h1>Coffee shop</h1>
          {/* Both labels are in the markup and share one grid cell, so the
              badge is as wide as the longer one whichever shows. */}
          <span class={["badge", { on: hydrated() }]}>
            <span>Server HTML: not yet live</span>
            <span>Hydrated: interactive now</span>
          </span>
          {/* Plain links: without JavaScript they load the page for that
              range. With it, the click sets the signal instead. `latest`
              marks the picked range while its data is still on the way. */}
          <nav aria-label="Range">
            <For each={RANGES}>
              {(range) => (
                <a
                  href={`?days=${range}`}
                  aria-current={latest(days) === range ? "page" : undefined}
                  onClick={(event) => pick(range, event)}
                >
                  {range} days
                </a>
              )}
            </For>
          </nav>
        </header>
        <p class="intro">
          Each panel is its own database query, slowed down so you can watch.
          The server sent this page before any of them had answered, then
          streamed each panel in. <a href="">Reload</a> to see it again, or pick
          a range to have the browser ask.
        </p>

        <main>
          <Panel title="Summary" takes={TAKES.summary} on={days()}>
            {/* isPending: an action said these numbers are about to change. */}
            <dl class={{ stale: isPending(() => summary()) }}>
              <Figure label="Revenue" value={money(summary().data.revenue)} />
              <Figure label="Orders" value={summary().data.orders} />
              <Figure label="To ship" value={summary().data.open} />
            </dl>
            <Origin of={summary()} />
          </Panel>

          <Panel title="Revenue by day" takes={TAKES.daily} on={days()}>
            <ol class="chart">
              <For each={daily().data}>
                {(day) => (
                  <li
                    title={`${day.day}: ${money(day.revenue)}`}
                    style={{ height: `${(day.revenue / peak()) * 100}%` }}
                  />
                )}
              </For>
            </ol>
            <Origin of={daily()} />
          </Panel>

          <Panel tall title="Products" takes={TAKES.products} on={days()}>
            <table>
              <tbody>
                <For each={products().data}>
                  {(product) => (
                    <tr>
                      <th scope="row">{product.name}</th>
                      <td>{product.units} sold</td>
                      <td>{money(product.revenue)}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
            <Origin of={products()} />
          </Panel>

          <Panel tall title="Latest orders" takes={TAKES.orders}>
            <form onSubmit={submit}>
              <select name="product" aria-label="Product">
                <For each={MENU}>{(item) => <option>{item.name}</option>}</For>
              </select>
              <input
                name="quantity"
                aria-label="Quantity"
                type="number"
                min="1"
                max="9"
                value="1"
              />
              <button>Add order</button>
            </form>
            <ul class="orders">
              <For each={orders}>
                {(order) => (
                  <li class={{ saving: order.saving }}>
                    <span>
                      {order.quantity} × {order.product}
                    </span>
                    <Show when={order.saving}>
                      <small>saving…</small>
                    </Show>
                    <span class="total">{money(order.total)}</span>
                    <button
                      disabled={order.shipped || order.saving}
                      onClick={() => ship(order.id)}
                    >
                      {order.shipped ? "Shipped" : "Ship"}
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </Panel>
        </main>

        <script type="module" src="client.js" />
      </body>
    </html>
  );
}

/** A card whose content may still be loading, or may have failed. */
function Panel(props: {
  title: string;
  takes: number;
  /** Room for six rows. A panel is as high empty as full, so nothing moves when its content comes. */
  tall?: boolean;
  /** Shows the placeholder again when this changes and the content has to wait. */
  on?: unknown;
  children: JSX.Element;
}) {
  return (
    <section class={{ tall: props.tall }}>
      <h2>{props.title}</h2>
      <Errored fallback={(error) => <p role="alert">{String(error())}</p>}>
        <Loading
          on={props.on}
          fallback={
            <p class="loading" style={{ "--takes": `${props.takes}ms` }}>
              Waiting for a {props.takes / 1000} s query…
            </p>
          }
        >
          {props.children}
        </Loading>
      </Errored>
    </section>
  );
}

/** Who asked for a panel's data. */
function Origin(props: { of: Loaded<unknown> }) {
  return (
    <footer class={props.of.by}>
      {props.of.by === "server"
        ? "Streamed by the server"
        : "Fetched by the browser"}
    </footer>
  );
}

function Figure(props: { label: string; value: string | number }) {
  return (
    <div>
      <dt>{props.label}</dt>
      <dd>{props.value}</dd>
    </div>
  );
}
