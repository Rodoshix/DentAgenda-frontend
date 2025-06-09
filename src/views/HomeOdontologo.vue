<template>
    <v-container fluid class="pa-0">
      <!-- HEADER -->
      <v-app-bar flat color="primary" dark>
        <v-toolbar-title>🦷 DentAgenda - Panel del Odontólogo</v-toolbar-title>
        <v-spacer />
        <v-btn color="white" variant="text" class="me-4" @click="cerrarSesion">
          Cerrar sesión
        </v-btn>
      </v-app-bar>
  
      <!-- TABS -->
      <v-tabs
        v-model="vista"
        background-color="primary"
        dark
        fixed-tabs
      >
        <v-tab value="agenda">Mi Agenda</v-tab>
        <v-tab value="disponibilidad">Mi Disponibilidad</v-tab>
      </v-tabs>
  
      <!-- CONTENIDO -->
      <v-container class="mt-4">
        <component
          :is="componenteActual"
          :key="vista"
        />
      </v-container>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import AgendaOdontologo from '@/components/odontologo/AgendaOdontologo.vue'
  import BloqueoDisponiblidadOdontologo from '@/components/odontologo/BloqueoDisponiblidadOdontologo.vue'
  
  const router = useRouter() // ✅ solo una vez
  const vista = ref('agenda')
  
  const componenteActual = computed(() => {
    if (vista.value === 'agenda') return AgendaOdontologo
    if (vista.value === 'disponibilidad') return BloqueoDisponiblidadOdontologo
    return null
  })
  
  function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('rol')
    localStorage.removeItem('rut')
    router.push('/login')
  }
  </script>