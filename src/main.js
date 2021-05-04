import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import i18n from "@/plugins/i18n"; // path to vuetify export
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  router,
  vuetify,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
