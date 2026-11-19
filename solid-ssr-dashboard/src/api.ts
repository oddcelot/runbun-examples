import { createContext } from "solid-js";

export const MENU = [
  { name: "Espresso beans", price: 1450 },
  { name: "Filter beans", price: 1300 },
  { name: "Pour-over kit", price: 3900 },
  { name: "Paper filters", price: 600 },
  { name: "Hand grinder", price: 7400 },
  { name: "Mug", price: 1800 },
];

export type Summary = { revenue: number; orders: number; open: number };
export type Day = { day: string; revenue: number };
export type Product = { name: string; units: number; revenue: number };
export type NewOrder = { product: string; quantity: number };
export type Order = NewOrder & {
  id: number;
  total: number;
  shipped: boolean;
  /** Only on what an action wrote ahead of the server's answer. */
  saving?: boolean;
};

/** An answer, and who asked for it: the server while it rendered the page, or the page itself. */
export type Loaded<T> = { data: T; by: "server" | "browser" };

/** The queries, as the database answers them (`db.ts`) and as the page asks the server for them (`client.tsx`). */
export interface Queries {
  summary(days: number): Promise<Summary>;
  daily(days: number): Promise<Day[]>;
  products(days: number): Promise<Product[]>;
  orders(): Promise<Order[]>;
  ship(id: number): Promise<void>;
  place(order: NewOrder): Promise<void>;
}

/**
 * What the components use. They only know this interface: on the server
 * it is the database, in the page it is `fetch`.
 */
export interface Api extends Omit<Queries, "summary" | "daily" | "products"> {
  summary(days: number): Promise<Loaded<Summary>>;
  daily(days: number): Promise<Loaded<Day[]>>;
  products(days: number): Promise<Loaded<Product[]>>;
}

export const apiOf = (queries: Queries, by: Loaded<unknown>["by"]): Api => ({
  ...queries,
  summary: async (days) => ({ data: await queries.summary(days), by }),
  daily: async (days) => ({ data: await queries.daily(days), by }),
  products: async (days) => ({ data: await queries.products(days), by }),
});

export const ApiContext = createContext<Api>();

/** How long each query takes, in ms. They are slowed down on purpose (`db.ts`). */
export const TAKES = { summary: 300, daily: 1200, products: 2200, orders: 700 };

export const RANGES = [7, 14, 30];

/** The range a URL asks for (`?days=14`), the same on the server and in the page. */
export const rangeOf = (url: string) => {
  const days = Number(new URL(url).searchParams.get("days"));
  return RANGES.includes(days) ? days : RANGES[0]!;
};
