// Server-side state, shared by the page and the API route (in memory: resets when the server restarts).
let count = 0;

export const getCount = () => count;

export function addToCount(by: number) {
  count += by;
  return count;
}
