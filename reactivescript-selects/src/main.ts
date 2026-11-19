import { createApp } from "@reactivescript/runtime";
import * as api from "./api.ts";
import main from "./app.rx";
import "./styles.css";

// `import pure { … } from "./api"` in app.rx calls the functions handed to the app here.
const app = createApp({ root: document.getElementById("app")!, api });
app.mount(main(app));
