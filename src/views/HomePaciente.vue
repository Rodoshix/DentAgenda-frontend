<template>
  <section>
    <!-- HEADER -->
    <header class="has-background-info p-4">
      <h1 class="title has-text-white">🦷 DentAgenda - Panel del Paciente</h1>
    </header>

    <div class="columns m-0" style="min-height: 90vh">
      <!-- SIDEBAR -->
      <aside class="column is-one-quarter p-4 has-background-white" style="border-right: 2px solid #00bcd4;">
        <p class="mb-4 has-text-weight-semibold">Menú</p>
        <button class="button is-info is-light is-fullwidth mb-2" @click="cambiarVista('agendar')">Agendar Cita</button>
        <button class="button is-info is-light is-fullwidth mb-2" @click="cambiarVista('calendario')">Calendario Citas</button>
        <button class="button is-info is-light is-fullwidth mb-2" @click="cambiarVista('historial')">Historial Citas</button>
        <button class="button is-info is-light is-fullwidth mb-2" @click="cambiarVista('perfil')">Editar Perfil</button>
      </aside>

      <!-- CONTENIDO -->
      <main class="column p-5" style="background: linear-gradient(to bottom, #e0f7fa, #ffffff); color: #333;">
        <component
          v-if="componenteActual && componenteKey"
          :is="componenteActual"
          :key="componenteKey"
          v-bind="componentProps"
        />
      </main>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

// Cambiar vista y forzar clave única
const cambiarVista = (nuevaVista) => {
  vista.value = nuevaVista
  componenteKey.value = `${nuevaVista}-${Date.now()}`
}

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

// Montaje inicial
onMounted(() => {
  fetchPaciente()
  fetchCitas()
  componenteKey.value = `${vista.value}-${Date.now()}`
})
</script>