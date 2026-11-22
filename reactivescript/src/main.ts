import { createApp } from "@reactivescript/runtime";
import { DevToolbar } from "@solidjs/start-devtools";
import { createComponent } from "solid-js";
import main from "./app.rx";
import "./styles.css";

const app = createApp({ root: document.getElementById("app")! });
const view = main(app);
// DevToolbar adds Solid's devtools dock at the bottom of the page.
app.mount(() =>
  createComponent(DevToolbar, {
    get children() {
      return view();
    },
  }),
);
