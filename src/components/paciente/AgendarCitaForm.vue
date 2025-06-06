<template>
    <div class="box">
      <h2 class="title is-4 mb-4">🗓️ Agendar Nueva Cita</h2>
  
      <div v-if="loading" class="has-text-grey">Cargando odontólogos...</div>
  
      <form v-else @submit.prevent="agendarCita">
        <!-- Odontólogo -->
        <div class="field">
          <label class="label">Odontólogo</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="form.odontologoId" @change="limpiarDisponibilidad">
                <option disabled value="">Seleccione un odontólogo</option>
                <option v-for="o in odontologos" :key="o.id" :value="o.id">
                  {{ o.nombre || 'Odontólogo sin nombre' }}
                </option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Fecha -->
        <div class="field">
          <label class="label">Fecha</label>
          <div class="control">
            <input class="input" type="date" v-model="form.fecha" @change="cargarDisponibilidad" />
          </div>
        </div>
  
        <!-- Hora -->
        <div class="field" v-if="disponibilidad.length > 0">
          <label class="label">Hora disponible</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="form.hora">
                <option disabled value="">Seleccione una hora</option>
                <option v-for="hora in disponibilidad" :key="hora">{{ hora }}</option>
              </select>
            </div>
          </div>
        </div>
  
        <div v-else-if="form.odontologoId && form.fecha" class="has-text-grey mb-3">
          No hay horarios disponibles para esa fecha.
        </div>
  
        <!-- Botón -->
        <div class="field mt-4">
          <button
            class="button is-info"
            type="submit"
            :disabled="!form.odontologoId || !form.fecha || !form.hora"
          >
            Confirmar Cita
          </button>
        </div>
  
        <!-- Confirmación -->
        <p v-if="confirmado" class="has-text-success">✅ ¡Cita agendada correctamente!</p>
        <p v-if="error" class="has-text-danger">❌ Error al agendar: {{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '../../interceptors/axiosAuth'
  
  const emit = defineEmits(['citaAgendada'])
  
  const odontologos = ref([])
  const disponibilidad = ref([])
  const loading = ref(true)
  const confirmado = ref(false)
  const error = ref(null)
  
  const form = ref({
    odontologoId: '',
    fecha: '',
    hora: '',
  })
  
  onMounted(async () => {
    confirmado.value = false
    error.value = null
    loading.value = true
    try {
      const res = await api.get('/odontologos') // ✅ usa `api`
      odontologos.value = res.data
      console.log('Odontólogos cargados:', res.data)
    } catch (e) {
      error.value = 'No se pudieron cargar los odontólogos.'
    } finally {
      loading.value = false
    }
  })
  
  const limpiarDisponibilidad = () => {
    form.value.hora = ''
    disponibilidad.value = []
  }
  
  const cargarDisponibilidad = async () => {
    disponibilidad.value = []
    if (!form.value.odontologoId || !form.value.fecha) return
    try {
      const res = await api.get(`/odontologos/${form.value.odontologoId}/disponibilidad`, {
      params: { fecha: form.value.fecha }
    })
      disponibilidad.value = res.data
    } catch (e) {
      error.value = 'No se pudo cargar la disponibilidad.'
    }
  }
  
  const agendarCita = async () => {
    try {
      const fechaHora = `${form.value.fecha}T${form.value.hora}:00`

      await api.post('/citas/agendar', {
        odontologoId: form.value.odontologoId,
        fechaHora: fechaHora,
        motivo: "Control general"  // puedes reemplazar por un campo editable si quieres
      })

      confirmado.value = true
      error.value = null
      emit('citaAgendada')
      setTimeout(() => (confirmado.value = false), 3000)
      form.value = { odontologoId: '', fecha: '', hora: '' }
      disponibilidad.value = []

    } catch (err) {
      console.error(err)
      error.value = 'Hubo un error al intentar registrar la cita.'
    }
  }
  </script>

  <style scoped>
  .select select,
  option {
    background-color: white !important;
    color: #222 !important;
  }

  option:checked {
    background-color: #00bcd4 !important;
    color: white !important;
  }
  </style>