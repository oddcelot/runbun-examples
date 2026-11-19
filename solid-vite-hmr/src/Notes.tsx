import { For } from "solid-js";

// Try it: turn the <ul> into an <ol>, or change the placeholder, and save. The notes stay.
export function Notes(props: {
  notes: string[];
  onAdd: (note: string) => void;
}) {
  return (
    <section class="card">
      <h2>Notes</h2>
      <ul>
        <For each={props.notes}>{(note) => <li>{note}</li>}</For>
      </ul>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const input = event.currentTarget.elements.namedItem(
            "note",
          ) as HTMLInputElement;
          if (input.value.trim()) props.onAdd(input.value.trim());
          input.value = "";
        }}
      >
        <input
          name="note"
          placeholder="A new note"
          aria-label="A new note"
          autocomplete="off"
        />
        <button>Add</button>
      </form>
    </section>
  );
}
