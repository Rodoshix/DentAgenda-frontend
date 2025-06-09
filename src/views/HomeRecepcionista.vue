<template>
  <v-container fluid class="pa-0">
    <!-- HEADER -->
    <v-app-bar flat color="info" dark>
      <v-toolbar-title>🦷 DentAgenda - Panel de Recepcionista</v-toolbar-title>
      <v-spacer />
      <v-btn
        color="white"
        variant="text"
        class="me-4"
        @click="cerrarSesion"
      >
        Cerrar sesión
      </v-btn>
    </v-app-bar>

    <!-- TABS -->
    <v-tabs
      v-model="vista"
      background-color="info"
      dark
      fixed-tabs
    >
      <v-tab value="registro">Registrar Paciente</v-tab>
      <v-tab value="citas">Gestión de Citas</v-tab>
      <v-tab value="disponibilidad">Disponibilidad</v-tab>
    </v-tabs>

    <!-- CONTENIDO -->
    <v-container class="mt-4">
      <component
        :is="componenteActual"
        :key="componenteKey"
      />
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Importar componentes
import RegistrarPacienteForm from '@/components/recepcionista/RegistrarPacienteForm.vue'
import GestionCitas from '@/components/recepcionista/GestionCitas.vue'
import DisponibilidadOdontologos from '@/components/recepcionista/DisponibilidadOdontologos.vue'

// Estado de la vista
const vista = ref('registro')

// Control de componente activo
const componenteActual = computed(() => {
  switch (vista.value) {
    case 'registro':
      return RegistrarPacienteForm
    case 'citas':
      return GestionCitas
    case 'disponibilidad':
      return DisponibilidadOdontologos
    default:
      return null
  }
})

const componenteKey = computed(() => vista.value)

// Cierre de sesión
const router = useRouter()
const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('rol')
  localStorage.removeItem('rut')
  router.push('/login')
}
</script>