import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../views/LandingPageView.vue'
import LogInView from '../views/LoginView.vue'
import SingUpView from '../views/SingUpView.vue'
import DashboardView from '../views/DashboardView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landingpage',
      component: LandingPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LogInView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SingUpView
    }, 
        {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      // Catch-all route for 404 errors - updated syntax for Vue Router 4
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
    {
      path: '/verify-email/:token',
      name: 'VerifyEmail',
      component: () => import('@/views/VerifyEmail.vue')
    }
  ],
})

router.beforeEach((to, from, next) => {
  // Make sure the route exists before attempting to navigate
  if (to.matched.length === 0) {
    console.error('Route not found:', to.path);
    next('/');
  } else {
    // Check if the component exists
    try {
      const component = to.matched[0].components.default;
      if (component) {
        next();
      } else {
        console.error('Component not found for route:', to.path);
        next('/');
      }
    } catch (error) {
      console.error('Error loading route:', error);
      next('/');
    }
  }
})

export default router
