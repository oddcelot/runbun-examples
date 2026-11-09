import { useEffect, useState } from "react";

export function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("…");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data: { message: string }) => setMessage(data.message));
  }, []);

  return (
    <main>
      <h1>Bun + React</h1>
      <p>{message}</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Clicked {count} times
      </button>
      <p>
        Edit <code>src/App.tsx</code> and run again.
      </p>
    </main>
  );
}
