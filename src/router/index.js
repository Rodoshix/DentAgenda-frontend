import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomePaciente from '@/views/HomePaciente.vue'
import HomeView from '@/views/HomeView.vue'
import HomeRecepcionista from '@/views/HomeRecepcionista.vue'
import HomeOdontologo from '@/views/HomeOdontologo.vue' 
// Agrega otras vistas según roles

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/paciente', component: HomePaciente },
  { path: '/recepcionista', component: HomeRecepcionista },
  { path: '/odontologo', component: HomeOdontologo },
  // Agrega más rutas para recepcionista, odontólogo, admin
]

export default createRouter({
  history: createWebHistory(),
  routes
})

