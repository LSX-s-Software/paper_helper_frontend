import App from "./App.vue";
import router from "./router";

// Pinia
import { createPinia } from "pinia";
const pinia = createPinia();

// element+
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/el-message-box.css";

const app = createApp(App);
app.use(router);
app.use(pinia);

app.mount("#app");
