import { createRouter, createWebHistory } from "vue-router";
import NoteIndex from "../views/notes/index.vue";
import NoteCreate from "../views/notes/create.vue";
import NoteShow from "../views/notes/show.vue";

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
    {
      path: "/:pathMatch(.*)*",
      redirect: "/", // fallback route
    },
  ],
});

export default router;
