import { createWebHistory, createRouter } from "vue-router";
import { client } from "./lib/client";

const routes = [
  { path: "/", component: () => import("./pages/Todos.vue") },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/Register.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log("Navigating from:", from.path);
  if (to.name == "login" || to.name == "register") {
    return next();
  }

  try {
    await client.get("/api/me");
    next();
  } catch {
    return next("/login");
  }
});

export default router;
