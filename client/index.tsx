import { render } from "preact";
import { App } from "./App";
import "./core/globalCSS";

render(<App />, document.getElementById("app")!);
