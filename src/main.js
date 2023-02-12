import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import router from "./router";
import { inspect } from "@xstate/inspect";

inspect({
  iframe: false, // open in new window
});

createApp(App).use(router).mount("#app");
