import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
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
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/comunity',
      name: 'Community',
      component: () => import('@/views/Comunity.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/criar-publicacao',
      name: 'CreatePost',
      component: () => import('@/components/CommunitiesPanel.vue'),
      meta: { requiresAuth: true }
    }

  ],
})


router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.matched.length === 0) {
    console.error('Rota não encontrada:', to.path);
    next('/');
  } else if (to.meta.requiresAuth && !userStore.accessToken) {
    console.warn('Acesso negado: precisa de login');
    next('/login');
  } else {
    next();
  }
});


export default router
