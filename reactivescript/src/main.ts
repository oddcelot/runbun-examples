import { createApp } from "@reactivescript/runtime";
import main from "./app.rx";
import "./styles.css";

const app = createApp({ root: document.getElementById("app")! });
app.mount(main(app));
