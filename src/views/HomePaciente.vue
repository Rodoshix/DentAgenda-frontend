<template>
  <v-container fluid class="pa-0">
    <!-- HEADER -->
    <v-app-bar flat color="info" dark>
      <v-toolbar-title>🦷 DentAgenda - Panel del Paciente</v-toolbar-title>
    </v-app-bar>

    <!-- TABS -->
    <v-tabs
      v-model="vista"
      background-color="info"
      dark
      fixed-tabs
    >
      <v-tab value="agendar">Agendar Cita</v-tab>
      <v-tab value="calendario">Calendario Citas</v-tab>
      <v-tab value="historial">Historial Citas</v-tab>
      <v-tab value="perfil">Editar Perfil</v-tab>
    </v-tabs>

    <!-- CONTENIDO -->
    <v-container class="mt-4">
      <component
        :is="componenteActual"
        :key="componenteKey"
        v-bind="componentProps"
      />
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'

// Componentes
import AgendarCitaForm from '@/components/paciente/AgendarCitaForm.vue'
import CalendarCitas from '@/components/paciente/CalendarCitas.vue'
import MisCitas from '@/components/paciente/MisCitas.vue'
import ProfileEditCard from '@/components/paciente/ProfileEditCard.vue'

// Estado principal
const vista = ref('agendar')
const componenteKey = ref(null)

const paciente = ref(null)
const citas = ref([])

// Cargar datos
const fetchPaciente = async () => {
  try {
    const res = await axios.get('/api/usuarios/perfil')
    paciente.value = res.data
  } catch (e) {
    console.error('Error al cargar paciente', e)
  }
}

const fetchCitas = async () => {
  try {
    const res = await axios.get('/api/citas/mis-citas')
    citas.value = res.data
  } catch (e) {
    console.error('Error al cargar citas', e)
  }
}

const handleCancelarCita = async (id) => {
  await axios.put(`/api/citas/${id}/cancelar`)
  fetchCitas()
}

const handleEditarCita = (cita) => {
  console.log('Editar cita:', cita)
}


// Detectar cambio de tab y forzar refresco de componente
watch(vista, (nuevo) => {
  componenteKey.value = `${nuevo}-${Date.now()}`
})

// Computar componente y props
const componenteActual = computed(() => {
  switch (vista.value) {
    case 'agendar': return AgendarCitaForm
    case 'calendario': return CalendarCitas
    case 'historial': return MisCitas
    case 'perfil': return ProfileEditCard
    default: return AgendarCitaForm
  }
})

const componentProps = computed(() => ({
  ...(paciente.value ? { paciente: paciente.value } : {}),
  ...(citas.value ? { citas: citas.value } : {}),
  perfilActualizado: fetchPaciente,
  citaAgendada: fetchCitas,
  cancelar: handleCancelarCita,
  editar: handleEditarCita,
}))

onMounted(() => {
  fetchPaciente()
  fetchCitas()
  componenteKey.value = `${vista.value}-${Date.now()}`
})
</script>

<style scoped>
.v-application {
  background: linear-gradient(to bottom, #e0f7fa, #ffffff);
}
</style>