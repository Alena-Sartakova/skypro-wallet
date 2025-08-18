import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AnalysisPage from '@/views/AnalysisPage.vue'
import ExpensesPage from '@/views/ExpensesPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import SignInPage from '@/views/SignInPage.vue'
import SignUpPage from '@/views/SignUpPage.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        redirect: '/analysis'
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
    component: SignInPage
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage
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

export default router
