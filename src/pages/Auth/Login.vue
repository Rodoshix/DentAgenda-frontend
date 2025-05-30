<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const rut = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const { login } = useAuth()

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  try {
    await login(rut.value, password.value)
  } catch (e) {
    error.value = 'Login fallido. Revisa tus credenciales.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-20 p-4 bg-white shadow rounded">
    <h2 class="text-xl font-semibold mb-4">Iniciar sesión</h2>
    <input v-model="rut" placeholder="RUT" class="input mb-2 w-full" />
    <input v-model="password" type="password" placeholder="Contraseña" class="input mb-2 w-full" />
    <button @click="handleLogin" class="btn w-full" :disabled="loading">
      {{ loading ? 'Ingresando...' : 'Ingresar' }}
    </button>
    <p class="text-red-500 text-sm mt-2" v-if="error">{{ error }}</p>
  </div>
</template>

<style lang="postcss" scoped>
.input {
  @apply border border-gray-300 rounded px-3 py-2;
}
.btn {
  @apply bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700;
}
</style>

