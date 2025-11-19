import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../../modules/auth/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../../modules/auth/views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../../modules/auth/views/ForgotPasswordView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/recovery-password',
      name: 'RecoveryPassword',
      component: () => import('../../modules/auth/views/RecoveryPasswordView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../../modules/vehicles/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/vehicles',
      name: 'Vehicles',
      component: () => import('../../modules/vehicles/views/VehiclesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../../modules/profile/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

// Guard de navegación para verificar autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('token');

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!token || !authStore.isAuthenticated) {
      next({ name: 'Login' });
    } else {
      next();
    }
    return;
  }
  
  // Verificar si la ruta requiere ser invitado (no autenticado)
  if (to.meta.requiresGuest) {
    if (token && authStore.isAuthenticated) {
      next({ name: 'Dashboard' });
    } else {
      // Validación especial para recovery-password: debe tener token en query params
      if (to.name === 'RecoveryPassword' && !to.query.token) {
        next({ name: 'Login' });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;

