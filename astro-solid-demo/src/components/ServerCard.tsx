import { For } from "solid-js";

// Used without a client: directive, so Astro renders it to HTML on the server and ships no JavaScript for it.
export default function ServerCard(props: { rows: [string, string][] }) {
  return (
    <section class="card">
      <h2>Rendered by Solid on the server</h2>
      <dl>
        <For each={props.rows}>
          {([name, value]) => (
            <>
              <dt>{name}</dt>
              <dd>{value}</dd>
            </>
          )}
        </For>
      </dl>
    </section>
  );
}
