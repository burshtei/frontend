import Vue from "vue";
import VueRouter from "vue-router";
import Actions from "@/components/Actions";
import Inventory from "@/components/Inventory";
import ExportImport from "@/components/ExportImport";
import Login from "@/components/Login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Inventory,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/actions",
    name: "Actions",
    component: Actions,
  },
  {
    path: "/inventory",
    name: "Inventory",
    component: Inventory,
  },
  {
    path: "/exportImport",
    name: "ExportImport",
    component: ExportImport,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let loggedIn =
    localStorage.getItem("token") != null
  if (to.path.endsWith("login") || loggedIn) {
    next();
  } else {
    next("/login");
  }
});

export default router;
