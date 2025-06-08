<template>
  <div class="perfil-box box">
    <h2 class="title is-4 mb-4, text-blue">👤 Editar Perfil</h2>

    <div v-if="!paciente" class="has-text-grey">Cargando datos del paciente...</div>

    <form v-else @submit.prevent="guardarCambios">
      <!-- Nombre editable -->
      <div class="field">
        <label class="label, text-dark">Nombre completo</label>
        <div class="control">
          <input class="input" type="text" v-model="form.nombre" />
        </div>
      </div>


      <!-- RUT -->
      <div class="field">
        <label class="label, text-dark">RUT</label>
        <div class="control">
          <input class="input" type="text" :value="paciente.rut" disabled />
        </div>
      </div>

      <!-- Correo -->
      <div class="field">
        <label class="label, text-dark">Correo</label>
        <div class="control">
          <input class="input" type="email" v-model="form.correo" />
        </div>
      </div>

      <!-- Teléfono -->
      <div class="field">
        <label class="label, text-dark">Teléfono</label>
        <div class="control">
          <input class="input" type="text" v-model="form.telefono" />
        </div>
      </div>

      <!-- Botón -->
      <div class="field mt-4">
        <button
          class="button is-primary"
          type="submit"
          :disabled="!form.correo || !form.telefono || !datosModificados"
        >
          Guardar Cambios
        </button>
      </div>

      <!-- Mensajes -->
      <p v-if="confirmado" class="has-text-success">✅ Perfil actualizado</p>
      <p v-if="error" class="has-text-danger">❌ {{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  paciente: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['perfilActualizado'])

const form = ref({
  nombre: '',
  correo: '',
  telefono: '',
})

const confirmado = ref(false)
const error = ref(null)

watch(
  () => props.paciente,
  (nuevo) => {
    if (nuevo) {
      form.value.nombre = nuevo.nombre || ''
      form.value.correo = nuevo.correo || ''
      form.value.telefono = nuevo.telefono || ''
    }
  },
  { immediate: true }
)

const datosModificados = computed(() => {
  return (
    form.value.nombre !== props.paciente.nombre ||
    form.value.correo !== props.paciente.correo ||
    form.value.telefono !== props.paciente.telefono
  )
})

const guardarCambios = async () => {
  try {
    await axios.put('/api/usuarios/perfil', {
    nombre: form.value.nombre,
    correo: form.value.correo,
    telefono: form.value.telefono,
  })
    confirmado.value = true
    error.value = null
    emit('perfilActualizado')
    setTimeout(() => (confirmado.value = false), 2500)
  } catch (err) {
    error.value = 'Error al actualizar el perfil'
    confirmado.value = false
  }
}
</script>

<style scoped>
.perfil-box {
  background-color: #fdfdfd;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

input {
  background-color: white !important;
  color: #222 !important;
}

.button[disabled] {
  color: white !important;
  background-color: #0f7785 !important; /* celeste clarito */
  border: none;
  opacity: 0.6;
}
</style>