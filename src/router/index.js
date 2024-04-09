import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
   
  ],
})

router.beforeEach((to, from, next) => {
  const access_token = localStorage.getItem('token')
  const isAuthenticated = access_token !== null
  
  // If user is not authenticated and the route is not the login page, redirect to login
  if (to.path === '/forgot-password' || to.path.startsWith('/reset-password/') ) {
    // Allow access to the forgot password page regardless of authentication status
    next()
  } else if (!isAuthenticated && to.path !== '/login') {
    // Redirect unauthenticated users to the login page
    next('/login')
  } else {
    // Continue navigation for authenticated users and other routes
    next()
  }
})


// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
