import { createWebHistory, createRouter } from "vue-router";

import About from "../views/About.vue";
import Catalogue from "../views/Catalogue.vue";
import Cookies from "../views/Cookies.vue";
import MakeBooking from "../views/MakeBooking.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Catalogue",
    component: Catalogue,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/cookies",
    name: "Cookies",
    component: Cookies,
  },
  {
    path: "/makebooking/:slot",
    name: "MakeBooking",
    component: MakeBooking,
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

// note that base goes in as arg to createWebHistory - if serving from subdir
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

//https://stackoverflow.com/questions/45091380/vue-router-keep-query-parameter-and-use-same-view-for-children
function hasQueryParams(route) {
  return !!Object.keys(route.query).length;
}

router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    next({ ...to, query: from.query });
  } else {
    next();
  }
});

export default router;
