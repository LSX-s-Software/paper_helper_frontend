import { createRouter, createWebHistory } from "vue-router";
import LoginRegView from "../views/LoginRegView.vue";

import { ElMessage } from "element-plus";

const routes = [
  {
    path: "/",
    name: "index",
    component: LoginRegView,
  },
  {
    path: "/home/:projectId",
    name: "home",
    meta: {
      needAuth: true,
    },
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/paper/:paperId",
    name: "paper",
    meta: {
      needAuth: true,
    },
    component: () => import("../views/PaperView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(to => {
  if (to.meta.needAuth) {
    //判断当前路由是否需要进行权限控制
    let token = localStorage.getItem("token");
    if (token == null || token == "") {
      router.replace("/");
      ElMessage({
        message: "您未登录",
        type: "error",
      });
      return false;
    }
    return true;
  } else {
    return true;
  }
});

export default router;
