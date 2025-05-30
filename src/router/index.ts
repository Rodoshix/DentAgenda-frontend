
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Poke from '@/pages/Poke.vue' // prueba de Poke

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: () => import('@/pages/Login.vue') },
  { path: '/poke', name: 'Poke', component: Poke },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router