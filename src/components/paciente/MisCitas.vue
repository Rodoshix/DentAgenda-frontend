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
                <th>Fecha</th>
                <th>Hora</th>
                <th>Odontólogo</th>
                <th>Estado</th>
                <th>Acciones</th>
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
                  </td>
                </tr>

                <tr v-if="citaExpandidaId === cita.id" class="bg-grey-lighten-4">
                  <td colspan="5" class="text-subtitle-2 pa-4">
                    <strong>Tratamiento:</strong> {{ cita.tratamiento || 'N/A' }}<br />
                    <strong>Observación:</strong> {{ cita.observacion || 'N/A' }}
                  </td>
                </tr>
              </template>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import api from '../../interceptors/axiosAuth'

const citas = ref([])

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

</script>