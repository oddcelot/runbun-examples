import { createSignal, createStore } from "solid-js";
import { Counter } from "./Counter.tsx";
import { Notes } from "./Notes.tsx";

// When the browser loaded this page: a hot update leaves it alone, a full reload moves it.
const loaded = new Date(performance.timeOrigin).toLocaleTimeString();

export function App() {
  // The state lives here, above the components you edit, so it outlives their hot updates.
  const [count, setCount] = createSignal(0);
  const [notes, setNotes] = createStore<string[]>([
    "Edit a component",
    "Watch it swap in place",
  ]);

  return (
    <main>
      <header>
        <h1>Solid 2 + Vite</h1>
        <p class="loaded">
          Page loaded at <b>{loaded}</b>
        </p>
      </header>

      <ol class="steps">
        <li>Click the counter and add a note.</li>
        <li>
          Open <code>src/Counter.tsx</code> or <code>src/Notes.tsx</code> and
          change something: a label, the step, the markup.
        </li>
        <li>
          The component swaps in place. The count, the notes and the load time
          above stay as they were.
        </li>
        <li>
          Change a colour in <code>src/styles.css</code>: it applies without a
          reload too.
        </li>
      </ol>

      <div class="cards">
        <Counter count={count()} onStep={(by) => setCount((c) => c + by)} />
        <Notes
          notes={notes}
          onAdd={(note) => setNotes((list) => void list.push(note))}
        />
      </div>
    </main>
  );
}
