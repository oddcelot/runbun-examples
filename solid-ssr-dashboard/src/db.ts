import { Database } from "bun:sqlite";
import { MENU, TAKES } from "./api.ts";
import type { Day, Order, Product, Queries, Summary } from "./api.ts";

const DAY = 86_400_000;
const db = new Database(":memory:");
db.run(
  "CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL)",
);
db.run(`CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  total INTEGER NOT NULL,
  shipped INTEGER NOT NULL DEFAULT 0,
  placed INTEGER NOT NULL
)`);

const addProduct = db.query("INSERT INTO products (name, price) VALUES (?, ?)");
for (const { name, price } of MENU) addProduct.run(name, price);

const addOrder = db.query(
  `INSERT INTO orders (product_id, quantity, total, shipped, placed)
   SELECT id, ?2, price * ?2, ?3, ?4 FROM products WHERE name = ?1`,
);
const pick = (n: number) => Math.floor(Math.random() * n);

// A month of orders, so every range has something to show.
const now = Date.now();
for (let day = 29; day >= 0; day--) {
  for (let i = 4 + pick(8); i > 0; i--) {
    const placed = now - day * DAY - pick(DAY / 2);
    addOrder.run(
      MENU[pick(MENU.length)]!.name,
      1 + pick(3),
      day > 0 ? 1 : 0,
      placed,
    );
  }
}

const since = (days: number) => Date.now() - days * DAY;

const summary = db.query<Summary, [number]>(
  `SELECT coalesce(sum(total), 0) AS revenue, count(*) AS orders,
          (SELECT count(*) FROM orders WHERE shipped = 0) AS open
   FROM orders WHERE placed >= ?`,
);
const daily = db.query<Day, [number]>(
  `SELECT strftime('%m-%d', placed / 1000, 'unixepoch') AS day, sum(total) AS revenue
   FROM orders WHERE placed >= ? GROUP BY day ORDER BY min(placed)`,
);
const products = db.query<Product, [number]>(
  `SELECT name, sum(quantity) AS units, sum(total) AS revenue
   FROM orders JOIN products ON products.id = product_id
   WHERE placed >= ? GROUP BY name ORDER BY revenue DESC`,
);
const orders = db.query<Omit<Order, "shipped"> & { shipped: number }, []>(
  `SELECT orders.id, name AS product, quantity, total, shipped
   FROM orders JOIN products ON products.id = product_id
   ORDER BY placed DESC, orders.id DESC LIMIT 6`,
);
const ship = db.query("UPDATE orders SET shipped = 1 WHERE id = ?");

/**
 * SQLite answers at once, so each query waits a while, as a slower database
 * or another service would. The waits differ: that is what lets the panels
 * arrive one by one.
 */
const slow = async <T>(ms: number, value: () => T) => {
  await Bun.sleep(ms);
  return value();
};

export const queries: Queries = {
  summary: (days) => slow(TAKES.summary, () => summary.get(since(days))!),
  daily: (days) => slow(TAKES.daily, () => daily.all(since(days))),
  products: (days) => slow(TAKES.products, () => products.all(since(days))),
  orders: () =>
    slow(TAKES.orders, () =>
      orders.all().map((order) => ({ ...order, shipped: !!order.shipped })),
    ),
  ship: (id) => slow(TAKES.orders, () => void ship.run(id)),
  place: ({ product, quantity }) =>
    slow(TAKES.orders, () => {
      if (!(quantity >= 1 && quantity <= 9)) throw new Error("1 to 9, please");
      addOrder.run(product, Math.floor(quantity), 0, Date.now());
    }),
};
