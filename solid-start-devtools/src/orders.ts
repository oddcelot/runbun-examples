// The "database": it lives on the server, in the Vite dev server's process. A function marked "use server" runs there;
// the browser gets a stub that POSTs to it, so every call below is one request in the devtools' Activity view.
export type Order = {
  id: number;
  product: string;
  quantity: number;
  shipped: boolean;
};

export const PRODUCTS = ["Espresso", "Flat white", "Cold brew", "Croissant"];

const orders: Order[] = [
  { id: 1, product: "Flat white", quantity: 2, shipped: true },
  { id: 2, product: "Croissant", quantity: 3, shipped: false },
  { id: 3, product: "Cold brew", quantity: 1, shipped: false },
];

const slow = () => new Promise((done) => setTimeout(done, 600));

export async function listOrders(): Promise<Order[]> {
  "use server";
  await slow(); // long enough to see the load in Activity, and the fallback on the page
  return structuredClone(orders);
}

export async function addOrder(
  product: string,
  quantity: number,
): Promise<Order> {
  "use server";
  await slow();
  const order = {
    id: Math.max(0, ...orders.map((o) => o.id)) + 1,
    product,
    quantity,
    shipped: false,
  };
  orders.push(order);
  return order;
}

export async function toggleShipped(id: number): Promise<void> {
  "use server";
  await slow();
  const order = orders.find((o) => o.id === id);
  if (order) order.shipped = !order.shipped;
}
