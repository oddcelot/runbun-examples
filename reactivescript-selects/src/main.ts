import { createApp } from "@reactivescript/runtime";
import { DevToolbar } from "@solidjs/start-devtools";
import { createComponent } from "solid-js";
import * as api from "./api.ts";
import main from "./app.rx";
import "./styles.css";

// `import pure { … } from "./api"` in app.rx calls the functions handed to the app here.
const app = createApp({ root: document.getElementById("app")!, api });
const view = main(app);
// DevToolbar adds Solid's devtools dock at the bottom of the page.
app.mount(() =>
  createComponent(DevToolbar, {
    get children() {
      return view();
    },
  }),
);
