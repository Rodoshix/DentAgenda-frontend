<template>
    <div class="modal is-active">
      <div class="modal-background" @click="$emit('cerrar')"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Registrar Nueva Cita</p>
          <button class="delete" aria-label="close" @click="$emit('cerrar')"></button>
        </header>
  
        <section class="modal-card-body">
          <div class="field">
            <label class="label">RUT del Paciente</label>
            <div class="control">
              <input
                class="input"
                v-model="rutPaciente"
                placeholder="12345678-9"
                @blur="verificarRut"
              />
            </div>
            <p v-if="rutInvalido" class="help is-danger">Paciente no encontrado.</p>
          </div>
  
          <div class="field">
            <label class="label">Odontólogo</label>
            <div class="select is-fullwidth">
              <select v-model="odontologoId">
                <option disabled value="">Selecciona un odontólogo</option>
                <option v-for="od in odontologos" :key="od.id" :value="od.id">{{ od.nombre }}</option>
              </select>
            </div>
          </div>
  
          <div class="field">
            <label class="label">Fecha</label>
            <div class="control">
              <input class="input" type="date" v-model="fecha" :min="minFecha" @change="cargarHorasDisponibles" />
            </div>
          </div>
  
          <div class="field">
            <label class="label">Hora disponible</label>
            <div class="select is-fullwidth">
              <select v-model="hora">
                <option disabled value="">Seleccione una hora</option>
                <option v-for="h in horasDisponibles" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>
          </div>
  
          <div class="field">
            <label class="label">Motivo</label>
            <div class="control">
              <input class="input" v-model="motivo" placeholder="Ej: Control general" />
            </div>
          </div>
  
          <p v-if="mensaje" class="notification is-danger mt-3">{{ mensaje }}</p>
          <p v-if="ok" class="notification is-success mt-3">Cita registrada exitosamente.</p>
        </section>
  
        <footer class="modal-card-foot">
          <button class="button is-success" @click="registrarCita">Registrar</button>
          <button class="button" @click="$emit('cerrar')">Cancelar</button>
        </footer>
      </div>
    </div>
  </template>
  
<script setup>
import { ref } from 'vue'
import api from '../../interceptors/axiosAuth'

const emit = defineEmits(['cerrar', 'cita-registrada']) // ✅ NECESARIO

const props = defineProps({
  odontologos: Array
})

const rutPaciente = ref('')
const pacienteId = ref(null)
const rutInvalido = ref(false)

const odontologoId = ref('')
const fecha = ref('')
const hora = ref('')
const motivo = ref('')
const horasDisponibles = ref([])

const mensaje = ref('')
const ok = ref(false)

const minFecha = new Date().toISOString().split('T')[0] // solo fecha YYYY-MM-DD

const verificarRut = async () => {
  rutInvalido.value = false
  pacienteId.value = null
  mensaje.value = ''

  if (!rutPaciente.value) return

  try {
    const response = await api.get(`/pacientes/${rutPaciente.value}`)
    pacienteId.value = response.data.id
  } catch (err) {
    rutInvalido.value = true
  }
}

const cargarHorasDisponibles = async () => {
  horasDisponibles.value = []
  hora.value = ''
  mensaje.value = ''

  if (!odontologoId.value || !fecha.value) return

  try {
    const response = await api.get(`/citas/disponibilidad?odontologoId=${odontologoId.value}&fecha=${fecha.value}`)
    horasDisponibles.value = response.data[0]?.horasDisponibles || []
  } catch (err) {
    mensaje.value = 'Error al cargar disponibilidad.'
  }
}

const registrarCita = async () => {
  ok.value = false
  mensaje.value = ''

  if (!pacienteId.value) {
    mensaje.value = 'Debes ingresar un RUT válido.'
    return
  }

  if (!odontologoId.value || !fecha.value || !hora.value || !motivo.value) {
    mensaje.value = 'Todos los campos son obligatorios.'
    return
  }

  try {
    const fechaHoraFinal = `${fecha.value}T${hora.value}:00`

    await api.post('/citas/nousuario', {
      pacienteId: pacienteId.value,
      odontologoId: odontologoId.value,
      fechaHora: fechaHoraFinal,
      motivo: motivo.value
    })

    ok.value = true
    mensaje.value = ''
    emit('cita-registrada')

    rutPaciente.value = ''
    pacienteId.value = null
    odontologoId.value = ''
    fecha.value = ''
    hora.value = ''
    motivo.value = ''
    horasDisponibles.value = []
    rutInvalido.value = false

    setTimeout(() => {
      ok.value = false
    }, 3000)

  } catch (err) {
    ok.value = false
    console.log('Catch:', err)
    if (err.response?.status === 409) {
      mensaje.value = 'Horario ocupado. Selecciona otra hora.'
    } else {
      mensaje.value = 'Error al registrar la cita.'
    }
  }
}
</script>