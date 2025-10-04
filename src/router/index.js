import { createRouter, createWebHistory } from "vue-router";
import NoteIndex from "../views/notes/index.vue";
import NoteCreate from "../views/notes/create.vue";
import NoteShow from "../views/notes/show.vue";
import AuthLogin from "@/views/auth/login/index.vue";
import AuthSignUp from "@/views/auth/registration/index.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Dashboard from "@/views/dashboard/index.vue";
import DashboardUsers from "@/views/dashboard/users/index.vue";
import DashboardNotes from "@/views/dashboard/notes/index.vue";
import Home from "@/views/home/index.vue";
import api from "@/services/api.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/notes",
      name: "notes",
      component: NoteIndex,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/profile/index.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/note-create",
      name: "note-create",
      component: NoteCreate,
      meta: { requiresAuth: true },
    },
    {
      path: "/notes/:id",
      name: "note-show",
      component: NoteShow,
      meta: { requiresAuth: true },
    },

    { path: "/login", component: AuthLogin },
    { path: "/register", component: AuthSignUp },
    {
      path: "/dashboard",
      component: AuthLayout,
      meta: { requiresAuth: true },
      children: [
        { path: "", component: Dashboard },
        { path: "users", component: DashboardUsers },
        { path: "notes", component: DashboardNotes },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/", // fallback route
    },
  ],
});

// Global navigation guard: require auth for protected routes and admin for dashboard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((r) => r.meta && r.meta.requiresAuth);
  if (!requiresAuth) return next();

  // 1) Try cached user
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("activeUser"));
  } catch (_) {}

  // 2) If missing, validate via backend using cookies
  if (!user) {
    try {
      const res = await api.get("/auth/me");
      user = res.data?.data || null;
      if (user) localStorage.setItem("activeUser", JSON.stringify(user));
    } catch (_) {
      return next("/login");
    }
  }

  // 3) Admin gate for dashboard
  if (to.path.startsWith("/dashboard") && user?.role !== "admin") {
    return next("/");
  }

  return next();
});

export default router;
