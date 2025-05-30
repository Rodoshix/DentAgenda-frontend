
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Auth/Login.vue'
import { useAuthStore } from '@/store/auth'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', component: Login },

  { path: '/', component: Home },
  { path: '/login', component: Login },
  {
    path: '/paciente',
    component: () => import('@/pages/Paciente/Dashboard.vue'),
    meta: { requiresAuth: true, rol: 'PACIENTE' }
  },
  {
    path: '/recepcionista',
    component: () => import('@/pages/Recepcionista/Dashboard.vue'),
    meta: { requiresAuth: true, rol: 'RECEPCIONISTA' }
  },
  {
    path: '/odontologo',
    component: () => import('@/pages/Odontologo/Dashboard.vue'),
    meta: { requiresAuth: true, rol: 'ODONTOLOGO' }
  },
  {
    path: '/unauthorized',
    component: () => import('@/pages/Unauthorized.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 Middleware de protección de rutas
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  // Si requiere login y no está autenticado
  if (to.meta.requiresAuth && !auth.token) {
    return next('/login')
  }

  // Si requiere un rol específico y no coincide
  if (to.meta.rol && auth.usuario?.rol !== to.meta.rol) {
    return next('/unauthorized')
  }

  next()
})

export default router