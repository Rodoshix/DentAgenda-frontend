<template>
  <div class="calendar-container">
    <h2 class="title is-4 mb-4, text-black">📅 Calendario de Próximas Citas</h2>
    <FullCalendar :options="calendarOptions" />
  </div>

  <!-- Popup al seleccionar una cita -->
  <v-dialog v-model="dialogVisible" max-width="400">
    <v-card>
      <v-card-title class="headline">🦷 Detalle de Cita</v-card-title>
      <v-card-text v-if="eventoSeleccionado">
        <p><strong class = "text-black">🕒 Hora:</strong> {{ formatHora(eventoSeleccionado.start) }}</p>
        <p><strong class = "text-black">👨‍⚕️ Odontólogo:</strong> {{ eventoSeleccionado.extendedProps.odontologo }}</p>
        <p><strong class = "text-black">💬 Motivo:</strong> {{ eventoSeleccionado.extendedProps.motivo || 'Sin observaciones' }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue" text @click="dialogVisible = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const props = defineProps({
  citas: Array,
  paciente: Object,
  perfilActualizado: Function,
  citaAgendada: Function,
  cancelar: Function,
  editar: Function,
})

const dialogVisible = ref(false)
const eventoSeleccionado = ref(null)

function formatHora(fechaIso) {
  const date = new Date(fechaIso)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const calendarOptions = computed(() => {
  const eventos = []

  const hoy = new Date()
  const hoyISO = hoy.toISOString().substring(0, 10)

  const dentroDeUnAño = new Date(hoy)
  dentroDeUnAño.setFullYear(hoy.getFullYear() + 1)
  const finISO = dentroDeUnAño.toISOString().substring(0, 10)

  for (const cita of props.citas) {
    const fecha = cita.fechaHora?.substring(0, 10)
    if (fecha >= hoyISO && fecha <= finISO) {
      eventos.push({
        title: `Cita con ${cita.odontologoNombre || 'Odontólogo'}`,
        start: cita.fechaHora,
        allDay: false,
        extendedProps: {
          odontologo: cita.odontologoNombre || 'Odontólogo',
          motivo: cita.observacion || cita.tratamiento || '',
        },
      })
    }
  }

  return {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: '',
    },
    buttonText: {
      today: '📅 Hoy',
      prev: '⬅️',
      next: '➡️'
    },
    validRange: {
      start: hoyISO,
      end: finISO
    },
    events: eventos,
    eventClick: function (info) {
      eventoSeleccionado.value = info.event
      dialogVisible.value = true
    }
  }
})
</script>

<style scoped>
.fc {
  background-color: #1e1e2f; /* gris oscuro tipo dark mode */
  color: #f0f0f0;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  font-family: 'Segoe UI', sans-serif;
}

.fc-button {
  background-color: #00bcd4 !important;
  border: none;
  color: white !important;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
  text-transform: none;
}

.fc-daygrid-event {
  background-color: #00bcd4;
  border: none;
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 0.8rem;
  color: white;
}

.fc-event-title {
  font-weight: 600;
}

.fc-toolbar-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffffff;
}

.fc-col-header-cell {
  color: #b0c4de;
}

.fc-day {
  background-color: #2c2c3e;
  border: 1px solid #444;
}

.fc-day-today {
  background-color: #2e7d32 !important;
}

.calendar-container {
  background-color: transparent;
  padding: 0;
  border: none;
  box-shadow: none;
}

.fc-button-active {
  background-color: #007c91 !important;
}

.fc-button:hover {
  background-color: #0097a7 !important;
  cursor: pointer;
}
</style>