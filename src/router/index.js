import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
   
  ],
})

router.beforeEach(async (to, from, next) => {
  const access_token = localStorage.getItem('token')

  // const config=
  // const responce= await axios.("/user",)
  const isAuthenticated = access_token !== null
  const type=localStorage.getItem('type')

  // If user is not authenticated and the route is not the login page, redirect to login
  if (to.path === '/forgot-password' || to.path.startsWith('/reset-password/') ) {
   
    next()
  } else if (!isAuthenticated && to.path !== '/login') {
    
    next('/login')
  }
  else {
    if (type != 'SA' && to.path === '/company') {
      // If the user is a company admin (CA) and trying to access /company path, redirect to home
      next('/')
    } else {
      // Allow navigation for authenticated users or for other routes
      next()
    }
  }
 
})



// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
