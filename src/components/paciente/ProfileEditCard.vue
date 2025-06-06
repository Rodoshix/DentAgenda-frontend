<template>
  <div class="box">
    <h2 class="title is-4 mb-4">👤 Editar Perfil</h2>

    <div v-if="!paciente" class="has-text-grey">Cargando datos del paciente...</div>

    <form v-else @submit.prevent="guardarCambios">
      <!-- Nombre -->
      <div class="field">
        <label class="label">Nombre completo</label>
        <div class="control">
          <input class="input" type="text" :value="paciente.nombre" disabled />
        </div>
      </div>

      <!-- RUT -->
      <div class="field">
        <label class="label">RUT</label>
        <div class="control">
          <input class="input" type="text" :value="paciente.rut" disabled />
        </div>
      </div>

      <!-- Correo editable -->
      <div class="field">
        <label class="label">Correo</label>
        <div class="control">
          <input class="input" type="email" v-model="form.correo" />
        </div>
      </div>

      <!-- Teléfono editable -->
      <div class="field">
        <label class="label">Teléfono</label>
        <div class="control">
          <input class="input" type="text" v-model="form.telefono" />
        </div>
      </div>

      <div class="field mt-4">
        <button class="button is-info" type="submit">Guardar Cambios</button>
      </div>

      <p v-if="confirmado" class="has-text-success">✅ Perfil actualizado</p>
      <p v-if="error" class="has-text-danger">❌ {{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  paciente: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['perfilActualizado'])

const form = ref({
  correo: '',
  telefono: '',
})

const confirmado = ref(false)
const error = ref(null)

// Inicializar datos
watch(
  () => props.paciente,
  (nuevo) => {
    if (nuevo) {
      form.value.correo = nuevo.correo || ''
      form.value.telefono = nuevo.telefono || ''
    }
  },
  { immediate: true }
)

const guardarCambios = async () => {
  try {
    await axios.put('/api/pacientes/actualizar-perfil', {
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