import { DevToolbar } from "@solidjs/start-devtools";
import { render } from "@solidjs/web";
import { App } from "./App.tsx";
import "./styles.css";

// DevToolbar adds Solid's devtools dock at the bottom of the page (in development; it renders only its children in a
// production build).
render(
  () => (
    <DevToolbar>
      <App />
    </DevToolbar>
  ),
  document.getElementById("app")!,
);
