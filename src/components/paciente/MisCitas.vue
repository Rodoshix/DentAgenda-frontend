<template>
  <v-container>
    <h2 class="text-h5 mb-4">📖 Historial de Citas</h2>

    <v-expansion-panels multiple>
      <v-expansion-panel
        v-for="(grupo, mes) in citasAgrupadasPorMes"
        :key="mes"
      >
        <v-expansion-panel-title>
          {{ formatearMes(mes) }} - {{ grupo.length }} cita(s)
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-table class="bg-white text-black" density="comfortable">
            <thead>
              <tr>
                <th class="text-black">Fecha</th>
                <th class="text-black">Hora</th>
                <th class="text-black">Odontólogo</th>
                <th class="text-black">Estado</th>
                <th class="text-black">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="cita in grupo" :key="cita.id">
                <tr @click="toggleDetalle(cita.id)" style="cursor: pointer;">
                  <td>{{ formatFecha(cita.fechaHora) }}</td>
                  <td>{{ formatHora(cita.fechaHora) }}</td>
                  <td>{{ cita.odontologoNombre || 'N/A' }}</td>
                  <td>{{ cita.estado }}</td>
                  <td>
                    <v-btn
                      v-if="cita.estado === 'PENDIENTE'"
                      color="error"
                      size="small"
                      @click.stop="cancelarCita(cita.id)"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      v-if="puedeEditar(cita)"
                      color="warning"
                      size="small"
                      @click.stop="abrirDialogoEditar(cita)"
                    >
                      Editar
                    </v-btn>
                  </td>
                </tr>

                <tr v-if="citaExpandidaId === cita.id" class="bg-grey-lighten-4">
                  <td colspan="5" class="text-subtitle-2 pa-4">
                    <strong class="text-black">Tratamiento:</strong> {{ cita.tratamiento || 'N/A' }}<br />
                    <strong class="text-black">Observación:</strong> {{ cita.observacion || 'N/A' }}
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>

  <!-- Dialogo editar -->
  <v-dialog v-model="dialogEditar" max-width="400">
    <v-card>
      <v-card-title>Editar Cita</v-card-title>
      <v-card-text>
        <div class="mb-4">
          <strong class="text-black">Selecciona una nueva fecha</strong>
          <v-date-picker
            v-model="nuevaFecha"
            :min="minimaFecha"
            hide-header
            @update:modelValue="cargarHorasDisponibles"
          />
        </div>
        <div>
          <strong class="text-black">Selecciona una nueva hora</strong>
          <v-select
            v-model="nuevaHora"
            :items="horasDisponibles"
            label="Horas disponibles"
            dense
            outlined
            placeholder="Selecciona hora"
            :menu-props="{ maxHeight: '200px' }"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="blue" @click="dialogEditar = false">Cancelar</v-btn>
        <v-btn text color="green" @click="guardarReprogramacion">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import api from '../../interceptors/axiosAuth'

  const props = defineProps(['paciente', 'citas', 'perfilActualizado', 'citaAgendada', 'cancelar', 'editar'])

  const citas = ref([])

  onMounted(() => {
    citas.value = props.citas ?? []
  })

  onMounted(async () => {
    try {
      const response = await api.get('/citas/mis-citas')
      citas.value = response.data
    } catch (error) {
      console.error('Error al cargar citas:', error)
    }
  })

  const citasAgrupadasPorMes = computed(() => {
    const agrupadas = {}
    for (const cita of citas.value) {
      const mes = cita.fechaHora.substring(0, 7) // "YYYY-MM"
      if (!agrupadas[mes]) agrupadas[mes] = []
      agrupadas[mes].push(cita)
    }
    return agrupadas
  })

  function formatFecha(fechaIso) {
    return new Date(fechaIso).toLocaleDateString()
  }

  function formatHora(fechaIso) {
    return new Date(fechaIso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function formatearMes(iso) {
    const fecha = new Date(iso + '-01')
    return fecha.toLocaleString('es-CL', { month: 'long', year: 'numeric' })
  }

  function cancelarCita(id) {
    if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      api
        .put(`/citas/${id}/cancelar`)
        .then(() => {
          citas.value = citas.value.map(c =>
            c.id === id ? { ...c, estado: 'CANCELADA' } : c
          )
        })
        .catch(err => {
          alert('Error al cancelar la cita')
          console.error(err)
        })
    }
  }

  const citaExpandidaId = ref(null)
  function toggleDetalle(id) {
    citaExpandidaId.value = citaExpandidaId.value === id ? null : id
  }

  const dialogEditar = ref(false)
  const citaAEditar = ref(null)
  const nuevaFecha = ref('')
  const nuevaHora = ref('')
  const horasDisponibles = ref([])
  const minimaFecha = new Date().toISOString().substring(0, 10)

  function puedeEditar(cita) {
    const hoy = new Date().toISOString().substring(0, 10)
    const fechaCita = cita.fechaHora.substring(0, 10)
    return cita.estado === 'PENDIENTE' && fechaCita > hoy
  }

  function abrirDialogoEditar(cita) {
  console.log("Cita recibida:", cita)
  citaAEditar.value = cita
  nuevaFecha.value = cita.fechaHora.substring(0, 10)
  nuevaHora.value = cita.fechaHora.substring(11, 16)
  dialogEditar.value = true
  cargarHorasDisponibles(nuevaFecha.value)
  }

  async function cargarHorasDisponibles(fecha) {
  nuevaHora.value = ''
  horasDisponibles.value = []

  // ⚠️ Extraer solo la parte YYYY-MM-DD
  const fechaSolo = typeof fecha === 'string'
    ? fecha.substring(0, 10)
    : new Date(fecha).toISOString().substring(0, 10)

  try {
    const res = await api.get(`/odontologos/${citaAEditar.value.odontologoId}/disponibilidad`, {
      params: { fecha: fechaSolo }
    })
    horasDisponibles.value = res.data
    console.log("Horas disponibles:", horasDisponibles.value)
  } catch (err) {
    console.error("Error al obtener disponibilidad:", err)
    horasDisponibles.value = []
  }
}

  async function guardarReprogramacion() {
    try {
      if (!horasDisponibles.value.includes(nuevaHora.value)) {
        alert("La hora seleccionada no está disponible.")
        return
      }

      const nuevaFechaHora = `${nuevaFecha.value}T${nuevaHora.value}:00`

      await api.put(`/citas/${citaAEditar.value.id}/reprogramar`, {
        nuevaFechaHora
      })

      citas.value = citas.value.map(c =>
        c.id === citaAEditar.value.id ? { ...c, fechaHora: nuevaFechaHora } : c
      )

      dialogEditar.value = false
    } catch (err) {
      alert("Error al reprogramar la cita")
      console.error(err)
    }
  }
</script>