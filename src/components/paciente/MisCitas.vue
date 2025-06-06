<template>
  <div class="box">
    <h2 class="title is-4 mb-4">📋 Historial de Citas</h2>

    <div v-if="!citas || !citas.length" class="has-text-grey">
      No tienes citas registradas aún.
    </div>

    <table v-else class="table is-striped is-fullwidth">
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
        <tr v-for="cita in citas" :key="cita.id">
          <td>{{ cita.fecha }}</td>
          <td>{{ cita.hora }}</td>
          <td>{{ cita.odontologoNombre }}</td>
          <td>{{ cita.estado }}</td>
          <td>
            <button
              class="button is-small is-warning mr-2"
              @click="$emit('editar', cita)"
              :disabled="cita.estado !== 'PENDIENTE'"
            >
              Editar
            </button>
            <button
              class="button is-small is-danger"
              @click="$emit('cancelar', cita.id)"
              :disabled="cita.estado !== 'PENDIENTE'"
            >
              Cancelar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  citas: {
    type: Array,
    required: true,
  },
})
defineEmits(['editar', 'cancelar'])
</script>