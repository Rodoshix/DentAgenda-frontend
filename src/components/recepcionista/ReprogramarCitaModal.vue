<template>
    <div class="modal is-active">
      <div class="modal-background" @click="emit('cerrar')"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Reprogramar Cita</p>
          <button class="delete" aria-label="close" @click="emit('cerrar')"></button>
        </header>
  
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Fecha actual</label>
            <p class="has-text-white">{{ cita.fechaHora.split('T')[0] }} a las {{ cita.fechaHora.split('T')[1].substring(0,5) }}</p>
          </div>
  
          <div class="field">
            <label class="label">Nueva Fecha</label>
            <input class="input" type="date" v-model="nuevaFecha" :min="minFecha" @change="cargarHoras" />
          </div>
  
          <div class="field">
            <label class="label">Hora disponible</label>
            <div class="select is-fullwidth">
              <select v-model="nuevaHora">
                <option disabled value="">Seleccione una hora</option>
                <option v-for="h in horasDisponibles" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>
          </div>
  
          <p v-if="mensaje" class="notification is-danger">{{ mensaje }}</p>
          <p v-if="ok" class="notification is-success">Cita reprogramada correctamente.</p>
        </section>
  
        <footer class="modal-card-foot">
          <button class="button is-success" @click="reprogramarCita">Guardar</button>
          <button class="button" @click="emit('cerrar')">Cancelar</button>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import api from '../../interceptors/axiosAuth'
  
  const props = defineProps({
    cita: Object
  })
  const emit = defineEmits(['cerrar', 'cita-reprogramada'])
  
  const nuevaFecha = ref('')
  const nuevaHora = ref('')
  const horasDisponibles = ref([])
  const mensaje = ref('')
  const ok = ref(false)
  
  const minFecha = new Date().toISOString().split('T')[0]
  
  const cargarHoras = async () => {
    horasDisponibles.value = []
    nuevaHora.value = ''
    mensaje.value = ''
    if (!nuevaFecha.value) return
  
    try {
      const response = await api.get(`/citas/disponibilidad?odontologoId=${props.cita.odontologoId}&fecha=${nuevaFecha.value}`)
      horasDisponibles.value = response.data[0]?.horasDisponibles || []
    } catch (err) {
      mensaje.value = 'Error al obtener disponibilidad.'
    }
  }
  
  const reprogramarCita = async () => {
    mensaje.value = ''
    ok.value = false
    if (!nuevaFecha.value || !nuevaHora.value) {
      mensaje.value = 'Debe seleccionar una fecha y hora.'
      return
    }
  
    const nuevaFechaHora = `${nuevaFecha.value}T${nuevaHora.value}:00`
  
    try {
      await api.put(`/citas/${props.cita.id}/reprogramar`, {
        nuevaFechaHora
      })
      ok.value = true
      emit('cita-reprogramada')
      setTimeout(() => emit('cerrar'), 1500)
    } catch (err) {
      if (err.response?.status === 409) {
        mensaje.value = 'Horario ocupado.'
      } else {
        mensaje.value = 'Error al reprogramar la cita.'
      }
    }
  }
  </script>