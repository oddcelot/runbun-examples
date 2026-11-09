import { createSignal } from "solid-js";

// Starts from the count the server rendered; changes go to the API route in src/pages/api/count.ts.
export default function Counter(props: { initial: number }) {
  const [count, setCount] = createSignal(props.initial);
  const add = async (by: number) => {
    const res = await fetch("/api/count", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ by }),
    });
    setCount(((await res.json()) as { count: number }).count);
  };
  return (
    <div class="counter">
      <button onClick={() => add(-1)}>-</button>
      <output>{count()}</output>
      <button onClick={() => add(1)}>+</button>
    </div>
  );
}
