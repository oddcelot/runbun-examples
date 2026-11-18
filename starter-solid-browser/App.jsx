import { createSignal } from "solid-js";

export function App() {
  const [count, setCount] = createSignal(0);

  return (
    <main>
      <h1>Solid in the browser</h1>
      <p>No server: the page is index.html and its scripts.</p>
      <button onClick={() => setCount(count() + 1)}>
        Clicked {count()} times
      </button>
      <p>
        Edit <code>App.jsx</code> and run again.
      </p>
    </main>
  );
}
