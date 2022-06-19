import { createRouter, createWebHistory } from "vue-router";
import LoginRegView from "../views/LoginRegView.vue";

const routes = [
  {
    path: "/",
    name: "index",
    component: LoginRegView,
  },
  {
    path: "/home/:projectId",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/paper/:paperId",
    name: "paper",
    component: () => import("../views/PaperView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
