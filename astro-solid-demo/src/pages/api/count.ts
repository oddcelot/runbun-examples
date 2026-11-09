import type { APIRoute } from "astro";
import { addToCount, getCount } from "../../lib/count";

// Rendered on demand, not prerendered.
export const prerender = false;

export const GET: APIRoute = () => Response.json({ count: getCount() });

export const POST: APIRoute = async ({ request }) => {
  const { by = 1 } = (await request.json()) as { by?: number };
  return Response.json({ count: addToCount(by) });
};
