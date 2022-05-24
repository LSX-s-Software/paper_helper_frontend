import { createRouter, createWebHashHistory } from "vue-router";
import LoginRegView from "../views/LoginRegView.vue";

const routes = [
  {
    path: "/",
    name: "index",
    component: LoginRegView,
  },
  {
    path: "/home",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/HomeView.vue"),
  },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
