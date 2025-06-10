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
              v-for="tratamiento in tratamientos"
              :key="tratamiento.id"
              dot-color="blue"
            >
              <v-card class="mb-3" elevation="2">
                <v-card-title>
                  🗓️ {{ tratamiento.fecha }}
                </v-card-title>
                <v-card-subtitle>Diagnóstico: {{ tratamiento.diagnostico }}</v-card-subtitle>
                <v-card-text>
                  <strong>Tratamiento:</strong> {{ tratamiento.tratamiento }}<br />
                  <strong>Observaciones:</strong> {{ tratamiento.observaciones || 'N/A' }}
                </v-card-text>
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
  
  const pacienteId = route.params.id
  const nombrePaciente = ref('')
  const tratamientos = ref([])
  
  const volverAAgenda = () => {
    router.push('/odontologo')
  }
  
  const cargarHistorial = async () => {
    try {
      const response = await api.get(`tratamientos/paciente/${pacienteId}`)
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