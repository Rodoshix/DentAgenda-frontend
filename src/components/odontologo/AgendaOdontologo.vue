<template>
  <div>
    <h2 class="title is-4 mb-4 text-black">📅 Mi Agenda</h2>

    <!-- Selector de fecha -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="fechaSeleccionada"
          label="Selecciona una fecha"
          type="date"
          :min="minFecha"
          @change="consultarCitas"
          hide-details
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
        Motivo: {{ cita.motivo }}<br />
        Estado: {{ cita.estado }}
      </v-card-subtitle>

      <v-card-actions>
        <v-btn
          size="small"
          color="info"
          @click="$router.push(`/odontologo/historial/${cita.pacienteRut}`)"
        >
          Ver historial
        </v-btn>

        <v-btn
          size="small"
          color="success"
          v-if="['CONFIRMADA', 'ATENDIDA'].includes(cita.estado) && !cita.tratamientoRegistrado"
          @click="abrirModal(cita)"
        >
          Registrar tratamiento
        </v-btn>
      </v-card-actions>
    </v-card>

    <RegistrarTratamiento
      v-if="citaSeleccionada"
      v-model="mostrarModal"
      :cita-id="citaSeleccionada.id"
      :paciente-id="citaSeleccionada.pacienteId"
      @cerrar="cerrarModal"
      @guardado="cerrarModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../../interceptors/axiosAuth'
import RegistrarTratamiento from '@/components/odontologo/RegistrarTratamiento.vue'

// Variables
const mostrarModal = ref(false)
const citaSeleccionada = ref(null)
const citas = ref([])

// Fecha mínima: hoy
const hoy = new Date().toISOString().split('T')[0]
const fechaSeleccionada = ref(hoy)
const minFecha = hoy

// Consultar citas del odontólogo
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

// Refrescar agenda al montar y cuando cambia la fecha
onMounted(consultarCitas)
watch(fechaSeleccionada, consultarCitas)

const abrirModal = (cita) => {
  citaSeleccionada.value = cita
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  citaSeleccionada.value = null
  consultarCitas()
}
</script>