<template>
  <div class="box">
    <h2 class="title is-4 mb-4">📅 Calendario de Próximas Citas</h2>

    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

const props = defineProps({
  citas: {
    type: Array,
    required: true,
  },
})

const calendarOptions = computed(() => {
  const eventos = []

  if (props.citas && props.citas.length > 0) {
    for (const cita of props.citas) {
      if (cita.fechaHoraInicio) {
        eventos.push({
          title: `Cita con ${cita.odontologoNombre || 'Odontólogo'}`,
          start: cita.fechaHoraInicio,
          end: cita.fechaHoraFin || cita.fechaHoraInicio,
          allDay: false,
        })
      }
    }
  }

  return {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: '',
    },
    events: eventos,
  }
})
</script>

<style scoped>
.fc {
  --fc-button-bg-color: #00bcd4;
  --fc-button-border-color: #00bcd4;
  --fc-button-hover-bg-color: #0097a7;
  --fc-button-hover-border-color: #0097a7;
  --fc-button-text-color: white;
  --fc-event-bg-color: #00bcd4;
  --fc-event-border-color: #00bcd4;
  font-family: 'Segoe UI', sans-serif;
}
</style>