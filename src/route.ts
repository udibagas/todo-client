import { createWebHistory, createRouter } from "vue-router";

const routes = [
  { path: "/", component: () => import("./pages/Todos.vue") },
  { path: "/register", component: () => import("./pages/Register.vue") },
  { path: "/login", component: () => import("./pages/Login.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
