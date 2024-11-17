import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router";
import routes from "~pages";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...setupLayouts(routes)],
});


//function for auth guard
router.beforeEach(async (to, from, next) => {
  const access_token = localStorage.getItem("token");

  const isAuthenticated = access_token !== null;
  const type = localStorage.getItem("type");

  // If user is not authenticated and the route is not the login page, redirect to login

  if (
    isAuthenticated &&
    (to.path === "/login" ||
      to.path === "/forgot-password" ||
      to.path.startsWith("/reset-password"))
  ) {
    next("/");
  } else if (
    !isAuthenticated &&
    (to.path === "/forgot-password" || to.path.startsWith("/reset-password"))
  ) {
    next();
  } else if (!isAuthenticated && to.path !== "/login") {
    next("/login");
  } else {
    if (type != "SA" && to.path === "/company") {
      next("/");
    } else {
      next();
    }
  }
});

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router;
