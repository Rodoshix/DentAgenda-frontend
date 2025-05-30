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
    // Aquí podrías redirigir a otra vista si el login es exitoso, ejemplo:
    // router.push('/dashboard')
  } catch (e: any) {
    if (e.response?.status === 401) {
      error.value = 'Credenciales inválidas. Intenta nuevamente.'
    } else {
      error.value = 'Ocurrió un error inesperado. Intenta más tarde.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-50 px-4">
    <div class="max-w-sm w-full bg-white p-6 shadow-md rounded-lg">
      <h2 class="text-2xl font-bold text-center text-blue-900 mb-6">Iniciar sesión</h2>

      <input v-model="rut" type="text" placeholder="RUT" autocomplete="username" class="w-full border border-gray-300 rounded px-3 py-2 mb-3
         focus:outline-none focus:ring-2 focus:ring-blue-300" />

      <input v-model="password" type="password" placeholder="Contraseña" autocomplete="current-password" class="w-full border border-gray-300 rounded px-3 py-2 mb-3
         focus:outline-none focus:ring-2 focus:ring-blue-300" />

      <button @click="handleLogin" :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
        {{ loading ? 'Ingresando...' : 'Ingresar' }}
      </button>

      <p class="text-red-500 text-sm mt-3 text-center" v-if="error">{{ error }}</p>

      <div class="mt-6 text-center text-sm text-gray-600">
        ¿No tienes cuenta?
        <RouterLink to="/crear-cuenta" class="text-blue-600 hover:underline ml-1">
          Crear cuenta
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.input {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.btn {
  @apply bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition;
}
</style>
