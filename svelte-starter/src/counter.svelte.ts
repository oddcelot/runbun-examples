// The count lives in a module of its own: hot replacement re-runs only the component you edit, so state kept here
// survives the edit, while a component's own `$state` starts over.
export const counter = $state({ count: 0 });
