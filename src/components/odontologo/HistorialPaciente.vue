<template>
  <v-container fluid class="pa-0">
    <!-- HEADER NAVBAR -->
    <v-app-bar flat color="info" dark>
      <v-toolbar-title>🦷 DentAgenda - Panel del Odontólogo</v-toolbar-title>
      <v-spacer />
      <v-btn color="white" variant="text" class="me-4" @click="volverAAgenda">
        Volver a agenda
      </v-btn>
    </v-app-bar>

    <!-- CONTENIDO -->
    <v-container class="mt-4">
      <v-card class="pa-4">
        <v-card-title>
          📝 Historial clínico de {{ nombrePaciente }}
        </v-card-title>
        <v-divider class="mb-3" />

        <v-alert
          v-if="tratamientos.length === 0"
          type="info"
          border="start"
          elevation="2"
        >
          Sin registros anteriores.
        </v-alert>

        <v-timeline v-else>
          <v-timeline-item
            v-for="t in tratamientos"
            :key="t.id"
            dot-color="blue"
            @click="toggleDetalles(t.id)"
            style="cursor: pointer"
          >
            <v-card elevation="2" class="mb-3">
              <v-card-title>
                📅 {{ t.fecha }}
              </v-card-title>
              <v-card-subtitle>
                Diagnóstico: {{ t.diagnostico }}
              </v-card-subtitle>

              <v-expand-transition>
                <div v-if="t.id === tratamientoExpandidoId" class="px-4 pb-4">
                  <p class="text-body-1 text-black font-weight-medium">
                    <span class="text-black font-weight-bold">Tratamiento:</span> {{ t.procedimiento }}
                  </p>
                  <p class="text-body-1 text-black font-weight-medium">
                    <span class="text-black font-weight-bold">Observaciones:</span> {{ t.observacion || 'N/A' }}
                  </p>
                </div>
              </v-expand-transition>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card>
    </v-container>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../../interceptors/axiosAuth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const rutPaciente = route.params.id
const nombrePaciente = ref('')
const tratamientos = ref([])
const tratamientoExpandidoId = ref(null)

const volverAAgenda = () => {
  router.push('/odontologo')
}

const toggleDetalles = (id) => {
  tratamientoExpandidoId.value = tratamientoExpandidoId.value === id ? null : id
}

const cargarHistorial = async () => {
  try {
    const response = await api.get(`tratamientos/paciente/${rutPaciente}`)
    tratamientos.value = response.data
    if (response.data.length > 0) {
      nombrePaciente.value = response.data[0].pacienteNombre || 'Paciente'
    }
  } catch (err) {
    tratamientos.value = []
  }
}

onMounted(() => {
  cargarHistorial()
})
</script>