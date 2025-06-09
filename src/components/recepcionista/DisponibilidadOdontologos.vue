<template>
  <div class="box">
    <h2 class="title is-4">Disponibilidad de Odontólogos</h2>

    <div class="field">
      <label class="label">Odontólogo</label>
      <div class="select is-fullwidth">
        <select v-model="odontologoId" @change="actualizarDisponibilidad">
          <option disabled value="">Seleccione un odontólogo</option>
          <option v-for="od in odontologos" :key="od.id" :value="od.id">{{ od.nombre }}</option>
        </select>
      </div>
    </div>

    <div class="tabs is-scrollable" v-if="diasDelMes.length">
      <ul>
        <li v-for="dia in diasDelMes" :key="dia" :class="{ 'is-active': dia === diaSeleccionado }">
          <a @click="diaSeleccionado = dia; cargarDisponibilidad()">{{ dia }}</a>
        </li>
      </ul>
    </div>

    <div v-if="error" class="notification is-danger">{{ error }}</div>

    <div v-if="disponibilidad.length && !error">
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Estado</th>
            <th>Paciente</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in disponibilidad" :key="item.hora">
            <td>{{ item.hora }}</td>
            <td>
              <span :class="item.paciente ? 'has-text-danger' : 'has-text-success'">
                {{ item.paciente ? 'Ocupada' : 'Disponible' }}
              </span>
            </td>
            <td>{{ item.paciente || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../interceptors/axiosAuth'

const odontologos = ref([])
const odontologoId = ref('')
const diasDelMes = ref([])
const diaSeleccionado = ref('')
const disponibilidad = ref([])
const error = ref(null)

const generarDiasMesActual = () => {
  const hoy = new Date()
  const año = hoy.getFullYear()
  const mes = hoy.getMonth() + 1
  const dias = new Date(año, mes, 0).getDate()

  diasDelMes.value = Array.from({ length: dias }, (_, i) =>
    new Date(año, mes - 1, i + 1).toISOString().split('T')[0]
  )
  diaSeleccionado.value = diasDelMes.value[0]
}

const cargarOdontologos = async () => {
  try {
    const res = await api.get('/odontologos')
    odontologos.value = res.data
  } catch (e) {
    error.value = 'Error al cargar odontólogos.'
  }
}

const cargarDisponibilidad = async () => {
  if (!odontologoId.value || !diaSeleccionado.value) return

  error.value = null
  disponibilidad.value = []

  try {
    const response = await api.get('/citas/disponibilidad/odontologo', {
      params: {
        odontologoId: odontologoId.value,
        desde: diaSeleccionado.value
      }
    })

    console.log('Disponibilidad recibida:', response.data)

    disponibilidad.value = response.data.map(hora => ({
      hora: hora.hora,
      paciente: hora.paciente
    }))

  } catch (e) {
    console.error(e)
    error.value = 'Error al obtener disponibilidad.'
  }
}

const actualizarDisponibilidad = () => {
  if (odontologoId.value) {
    cargarDisponibilidad()
  }
}

onMounted(() => {
  generarDiasMesActual()
  cargarOdontologos()
})
</script>