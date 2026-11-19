// Try it: change STEP or the button's label and save. The count keeps its value.
const STEP = 1;

export function Counter(props: {
  count: number;
  onStep: (by: number) => void;
}) {
  return (
    <section class="card">
      <h2>Counter</h2>
      <output>{props.count}</output>
      <button onClick={() => props.onStep(STEP)}>Add {STEP}</button>
    </section>
  );
}
