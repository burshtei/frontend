import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import he from "../locales/he";

Vue.use(Vuetify);

export default new Vuetify({
  rtl: true,
  lang: {
    locales: { he },
    current: "he",
  },
});
