import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>React in the browser</h1>
      <p>No server: the page is index.html and its scripts.</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Clicked {count} times
      </button>
      <p>
        Edit <code>App.tsx</code> and run again.
      </p>
    </main>
  );
}
