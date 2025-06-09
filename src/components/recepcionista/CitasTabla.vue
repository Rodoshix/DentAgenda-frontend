<template>
    <div v-if="citas.length">
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Odontólogo</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cita in citasPaginadas" :key="cita.id">
            <td style="min-height: 3rem;">{{ cita.fechaHora.split('T')[0] }}</td>
            <td>{{ cita.fechaHora.split('T')[1].substring(0, 5) }}</td>
            <td>{{ cita.odontologoNombre }}</td>
            <td>{{ cita.motivo }}</td>
            <td>{{ cita.estado }}</td>
            <td>
                <div class="buttons" style="min-height: 2rem;">
                    <button
                    v-if="sePuedeReprogramar(cita)"
                    class="button is-warning is-small"
                    @click="$emit('reprogramar', cita)"
                    >
                    Reprogramar
                    </button>
                    <button
                    v-if="sePuedeCancelar(cita)"
                    class="button is-danger is-small"
                    @click="$emit('cancelar', cita)"
                    >
                    Cancelar
                    </button>

                    <!-- Espacio fantasma si no hay botones -->
                    <span v-if="!sePuedeReprogramar(cita) && !sePuedeCancelar(cita)" style="display:inline-block; width: 150px;"></span>
                </div>
            </td>
          </tr>
  
          <!-- Relleno visual para mantener altura constante -->
          <tr v-for="i in filasFaltantes" :key="'vacio-' + i">
            <td colspan="6" style="height: 3rem;"></td>
          </tr>
        </tbody>
      </table>
  
      <!-- Paginación -->
      <nav
        class="pagination is-centered"
        role="navigation"
        aria-label="pagination"
        v-if="totalPaginas > 1"
      >
        <a
          class="pagination-previous"
          :disabled="paginaActual === 1"
          @click="paginaActual--"
        >
          Anterior
        </a>
        <a
          class="pagination-next"
          :disabled="paginaActual === totalPaginas"
          @click="paginaActual++"
        >
          Siguiente
        </a>
        <ul class="pagination-list">
          <li v-for="p in totalPaginas" :key="p">
            <a
              class="pagination-link"
              :class="{ 'is-current': p === paginaActual }"
              @click="paginaActual = p"
            >
              {{ p }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  
    <p v-else class="notification is-info">No hay citas para mostrar.</p>
  </template>
  
  <script setup>
  import { computed, ref, watch } from 'vue'
  
  const props = defineProps({
    citas: {
      type: Array,
      required: true
    }
  })
  
  const paginaActual = ref(1)
  const citasPorPagina = 7
  
  const totalPaginas = computed(() => {
    return Math.ceil(props.citas.length / citasPorPagina)
  })
  
  const citasPaginadas = computed(() => {
    const inicio = (paginaActual.value - 1) * citasPorPagina
    return props.citas.slice(inicio, inicio + citasPorPagina)
  })
  
  watch(() => props.citas, () => {
    paginaActual.value = 1
  })
  
  const filasFaltantes = computed(() => {
    const restantes = citasPorPagina - citasPaginadas.value.length
    return restantes > 0 ? restantes : 0
  })
  
  const sePuedeCancelar = (cita) => cita.estado === 'PENDIENTE'
  const sePuedeReprogramar = (cita) => cita.estado === 'PENDIENTE'
  </script>