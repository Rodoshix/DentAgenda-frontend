import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomePaciente from '@/views/HomePaciente.vue'
import HomeView from '@/views/HomeView.vue'
// Agrega otras vistas según roles

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/paciente', component: HomePaciente },
  // Agrega más rutas para recepcionista, odontólogo, admin
]

export default createRouter({
  history: createWebHistory(),
  routes
})

