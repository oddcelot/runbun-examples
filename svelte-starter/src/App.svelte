<script lang="ts">
  import { counter } from "./counter.svelte.ts";

  const increment = () => counter.count++;
</script>

<main>
  <h1>Svelte + Vite</h1>
  <button type="button" onclick={increment}>Count is {counter.count}</button>
  <p>Edit <code>src/App.svelte</code>: the page updates and the count stays.</p>
</main>

<style>
  main {
    font-family: system-ui, sans-serif;
    text-align: center;
    margin-top: 3rem;
  }
  button {
    font: inherit;
    padding: 0.4rem 1rem;
  }
</style>
