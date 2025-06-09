<template>
    <div class="box">
      <h2 class="title is-4">Gestión de Citas de Pacientes</h2>
  
      <!-- Filtros -->
      <div class="columns is-multiline">
        <div class="column is-4">
          <label class="label">RUT Paciente</label>
          <div class="field has-addons">
            <div class="control">
              <input class="input" type="text" placeholder="12345678-9" v-model="rutBusqueda" />
            </div>
            <div class="control">
              <button class="button is-link" @click="buscarCitas">Buscar</button>
            </div>
          </div>
        </div>
  
        <div class="column is-4">
          <label class="label">Odontólogo</label>
          <div class="select is-fullwidth">
            <select v-model="filtroOdontologo">
              <option value="">Todos</option>
              <option v-for="od in odontologos" :key="od.id" :value="od.nombre">{{ od.nombre }}</option>
            </select>
          </div>
        </div>
  
        <div class="column is-4">
          <label class="label">Estado</label>
          <div class="select is-fullwidth">
            <select v-model="filtroEstado">
              <option value="">Todos</option>
              <option>PENDIENTE</option>
              <option>ATENDIDA</option>
              <option>CANCELADA</option>
              <option>NO_ASISTIO</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="has-text-right mb-4">
        <button class="button is-success" @click="abrirModal">
            + Registrar Nueva Cita
        </button>
        </div>

        <RegistrarCitaModal
        v-if="mostrarModal"
        :odontologos="odontologos"
        @cerrar="mostrarModal = false"
        @cita-registrada="buscarCitas"
        />

      <!-- Citas Futuras -->
      <h3 class="subtitle mt-4">📅 Citas del día y futuras</h3>
      <CitasTabla :citas="filtrarCitas(futuras)" @cancelar="cancelarCita" @reprogramar="reprogramarCita" />
  
      <!-- Citas Pasadas -->
      <h3 class="subtitle mt-5">🕒 Citas Pasadas</h3>
      <CitasTabla :citas="filtrarCitas(pasadas)" @cancelar="cancelarCita" @reprogramar="reprogramarCita" />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import api from '../../interceptors/axiosAuth'
  import CitasTabla from './CitasTabla.vue'
  
  import RegistrarCitaModal from './RegistrarCitaModal.vue'
    
  const mostrarModal = ref(false)

  const rutBusqueda = ref('')
  const citas = ref([])
  const odontologos = ref([])
  const filtroOdontologo = ref('')
  const filtroEstado = ref('')
  
  const cargarOdontologos = async () => {
    try {
      const response = await api.get('/odontologos')
      odontologos.value = response.data
    } catch (error) {
      console.error('Error al cargar odontólogos:', error)
    }
  }

  const abrirModal = () => {
    cargarOdontologos()
    mostrarModal.value = true
  }

  const buscarCitas = async () => {
    if (!rutBusqueda.value) return
    try {
      const response = await api.get(`/citas/paciente/${rutBusqueda.value}`)
      citas.value = response.data
      odontologos.value = [...new Set(response.data.map(c => c.odontologoNombre))] // únicos
    } catch (err) {
      citas.value = []
      odontologos.value = []
    }
  }
  
  const ahora = new Date()
  const futuras = computed(() =>
    citas.value.filter(c => new Date(c.fechaHora) >= ahora)
  )
  const pasadas = computed(() =>
  [...citas.value]
    .filter(c => new Date(c.fechaHora) < ahora)
    .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)) // orden DESCENDENTE
  )
  
  const filtrarCitas = (lista) => {
    return lista.filter(c =>
      (!filtroOdontologo.value || c.odontologoNombre === filtroOdontologo.value) &&
      (!filtroEstado.value || c.estado === filtroEstado.value)
    )
  }
  
  const cancelarCita = async (cita) => {
    try {
      await api.put(`/citas/${cita.id}/cancelar`)
      buscarCitas()
    } catch (e) {
      alert('Error al cancelar la cita.')
    }
  }
  
  const reprogramarCita = (cita) => {
    alert(`Reprogramar cita ID ${cita.id} (en construcción)`)
  }
  </script>