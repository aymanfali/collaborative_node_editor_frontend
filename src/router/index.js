import { createRouter, createWebHistory } from "vue-router";
import NoteIndex from "../views/notes/index.vue";
import NoteCreate from "../views/notes/create.vue";
import NoteShow from "../views/notes/show.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Dashboard from "@/views/dashboard/index.vue";
import AuthLogin from "@/views/auth/login/index.vue";
import AuthSignUp from "@/views/auth/registration/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "notes",
      component: NoteIndex,
    },
    {
      path: "/notes",
      name: "note-create",
      component: NoteCreate,
    },
    {
      path: "/notes/:id",
      name: "note-show",
      component: NoteShow,
    },

    { path: "/login", component: AuthLogin },
    { path: "/register", component: AuthSignUp },

    // {
    //   path: "/dashboard",
    //   component: AuthLayout, // some layout component
    //   children: [
    //     { path: "", component: Dashboard }, // loads at /dashboard
    //   ],
    //   meta: { requiresAuth: true },
    // },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/", // fallback route
    },
  ],
});

export default router;
