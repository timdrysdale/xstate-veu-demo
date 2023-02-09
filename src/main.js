import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { inspect } from "@xstate/inspect";

inspect({
  // options
  // url: 'https://stately.ai/viz?inspect', // (default)
  iframe: false, // open in new window
});

createApp(App).mount("#app");
