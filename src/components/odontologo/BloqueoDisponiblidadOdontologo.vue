<template>
  <v-container>
    <h2 class="title is-4 mb-4 text-black">⛔ Bloqueo de Horarios</h2>

    <!-- Fecha -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="fechaSeleccionada"
          type="date"
          label="Selecciona una fecha"
          @change="cargarDisponibilidad"
        />
      </v-col>
    </v-row>

    <!-- Justificación -->
    <v-row class="mb-4">
      <v-col cols="12" sm="8">
        <v-textarea
          v-model="motivo"
          label="Motivo del bloqueo"
          rows="2"
          auto-grow
          outlined
          required
        />
      </v-col>
    </v-row>

    <!-- Lista de horarios -->
    <v-row>
      <v-col cols="12" sm="6" v-for="hora in horasPosibles" :key="hora">
        <v-checkbox
          :label="hora"
          :value="hora"
          v-model="horasSeleccionadas"
          :disabled="horasOcupadas.includes(hora)"
        />
      </v-col>
    </v-row>

    <!-- Botón -->
    <v-btn color="primary" class="mt-4" @click="bloquearHorarios">
      Guardar Bloqueos
    </v-btn>

    <!-- Mensajes -->
    <v-alert v-if="mensaje" :type="tipoMensaje" class="mt-4">
      {{ mensaje }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../interceptors/axiosAuth'

const fechaSeleccionada = ref(new Date().toISOString().substring(0, 10))
const horasSeleccionadas = ref([])
const horasOcupadas = ref([])
const motivo = ref('')
const mensaje = ref('')
const tipoMensaje = ref('success')

const horasPosibles = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00'
]

const cargarDisponibilidad = async () => {
  try {
    const [citasResp, bloqueosResp] = await Promise.all([
      api.get('/citas/odontologo', {
        params: { fecha: fechaSeleccionada.value }
      }),
      api.get('/bloqueos/odontologo', {
        params: {
          fecha: fechaSeleccionada.value,
          rut: localStorage.getItem('rut')
        }
      })
    ])

    const horasDeCitas = citasResp.data.map(cita => cita.hora)
    const horasDeBloqueos = bloqueosResp.data.map(b => b.horaInicio.substring(0, 5))

    horasOcupadas.value = [...new Set([...horasDeCitas, ...horasDeBloqueos])]
  } catch (error) {
    console.error('Error al cargar disponibilidad:', error)
    horasOcupadas.value = []
  }
}

const bloquearHorarios = async () => {
  if (!motivo.value.trim()) {
    mensaje.value = 'Debe ingresar un motivo para el bloqueo.'
    tipoMensaje.value = 'error'
    return
  }

  try {
    for (const hora of horasSeleccionadas.value) {
      await api.post('/bloqueos/registrar', {
        rutOdontologo: localStorage.getItem('rut'),
        fecha: fechaSeleccionada.value,
        horaInicio: hora,
        horaFin: hora,
        motivo: motivo.value.trim()
      })
    }

    mensaje.value = 'Bloqueos guardados correctamente.'
    tipoMensaje.value = 'success'
    horasSeleccionadas.value = []
    motivo.value = ''
    cargarDisponibilidad()
  } catch (error) {
    console.error('Error al guardar los bloqueos:', error)
    mensaje.value = 'Error al guardar los bloqueos.'
    tipoMensaje.value = 'error'
  }
}

cargarDisponibilidad()
</script>