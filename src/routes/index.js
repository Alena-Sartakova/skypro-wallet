import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AnalysisPage from '@/views/AnalysisPage.vue'
import ExpensesPage from '@/views/ExpensesPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import SignInPage from '@/views/SignInPage.vue'
import SignUpPage from '@/views/SignUpPage.vue'
import { authStore } from '@/store/authStore'

const routes = [
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/expenses'
      },
      {
        path: '/analysis',
        name: 'AnalysisPage',
        component: AnalysisPage
      },
      {
        path: '/expenses',
        name: 'ExpensesPage',
        component: ExpensesPage
      }
    ]
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInPage,
    meta: { guestOnly: true }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage,
    meta: { guestOnly: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundPage,
    name: 'NotFound'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, ) => {
  try {
    // 1. Инициализация хранилища с обработкой ошибок
    await authStore.init().catch(error => {
      console.error('Auth init failed:', error);
      authStore.logout();
    });

/*     // 2. Синхронное получение актуального статуса
    const isAuthenticated = authStore.isAuthenticated();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const guestOnly = to.matched.some(record => record.meta.guestOnly);

    console.log('Навигация:', {
      from: from.path,
      to: to.path,
      isAuthenticated,
      requiresAuth,
      guestOnly
    }); */
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Проверяем актуальность токена при каждом переходе
  const isTokenValid = await authStore.isTokenValid();
  
  if (requiresAuth && !isTokenValid) {
    await authStore.logout();
    return { path: '/signin', query: { redirect: to.fullPath } };
  }
  
  return true;


  } catch (error) {
    console.error('Критическая ошибка маршрутизации:', error);

  }
});


export default router

