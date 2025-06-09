<template>
    <div>
      <h2 class="title is-4 mb-4">📅 Mi Agenda</h2>
  
      <!-- Selector de fecha -->
      <v-row class="mb-4">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="fechaSeleccionada"
            label="Selecciona una fecha"
            type="date"
            @change="consultarCitas"
          />
        </v-col>
      </v-row>
  
      <!-- Lista de citas -->
      <v-alert
        v-if="citas.length === 0"
        type="info"
        border="start"
        elevation="2"
      >
        No hay citas agendadas para esta fecha.
      </v-alert>
  
      <v-card
        v-for="cita in citas"
        :key="cita.id"
        class="mb-3"
      >
        <v-card-title>
          🕒 {{ cita.hora }} - {{ cita.pacienteNombre }}
        </v-card-title>
        <v-card-subtitle>
          Motivo: {{ cita.motivo }}
        </v-card-subtitle>
      </v-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '../../interceptors/axiosAuth' // ✅ Versión correcta para tu proyecto
  
  const fechaSeleccionada = ref(new Date().toISOString().substring(0, 10))
  const citas = ref([])
  
  const consultarCitas = async () => {
    try {
      const response = await api.get('/citas/odontologo', {
        params: { fecha: fechaSeleccionada.value }
      })
      citas.value = response.data
    } catch (error) {
      console.error('Error al consultar citas del odontólogo:', error)
      citas.value = []
    }
  }
  
  onMounted(() => {
    consultarCitas()
  })
  </script>