<template>
    <div class="container">
      <h1 class="title has-text-centered">Panel de Recepcionista</h1>
        <button class="button is-light" @click="cerrarSesion">Cerrar sesión</button>
      <div class="tabs is-centered">
        <ul>
          <li :class="{ 'is-active': currentTab === 'registro' }" @click="currentTab = 'registro'"><a>Registrar Paciente</a></li>
          <li :class="{ 'is-active': currentTab === 'citas' }" @click="currentTab = 'citas'"><a>Gestión de Citas</a></li>
          <li :class="{ 'is-active': currentTab === 'disponibilidad' }" @click="currentTab = 'disponibilidad'"><a>Disponibilidad</a></li>
        </ul>
      </div>
  
      <div v-if="currentTab === 'registro'">
        <RegistrarPacienteForm />
      </div>
      <div v-else-if="currentTab === 'citas'">
        <GestionCitas />
      </div>
      <div v-else-if="currentTab === 'disponibilidad'">
        <DisponibilidadOdontologos />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import RegistrarPacienteForm from '@/components/recepcionista/RegistrarPacienteForm.vue'
  import GestionCitas from '@/components/recepcionista/GestionCitas.vue'
  import DisponibilidadOdontologos from '@/components/recepcionista/DisponibilidadOdontologos.vue'
  
  const currentTab = ref('registro')

  import { useRouter } from 'vue-router'
    const router = useRouter()

    const cerrarSesion = () => {
    localStorage.removeItem('token')
    router.push('/login')
    }
  </script>