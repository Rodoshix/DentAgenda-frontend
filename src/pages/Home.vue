<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { isAuthenticated, usuario, logout } = useAuth()
const router = useRouter()

const irADashboard = () => {
  if (usuario.value) {
    router.push(`/${usuario.value.rol.toLowerCase()}`)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-center px-4">
    <!-- Logo y nombre -->
    <div class="mb-8">
      <div class="flex items-center justify-center space-x-3">
        <div class="text-white bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
          🦷
        </div>
        <h1 class="text-3xl font-bold text-blue-900">DentAgenda</h1>
      </div>
    </div>

    <!-- Texto de bienvenida -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Bienvenido a DentAgenda</h2>
      <p class="text-gray-600 mt-2">Gestiona tus citas de manera fácil</p>
    </div>

    <!-- Botones -->
    <div class="flex flex-col space-y-4 w-full max-w-xs">
      <RouterLink
        to="/crear-cuenta"
        class="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Crear cuenta
      </RouterLink>
      <RouterLink
        to="/login"
        class="w-full bg-white text-blue-700 border border-blue-600 font-medium py-2 rounded-lg hover:bg-blue-50 transition"
      >
        Iniciar sesión
      </RouterLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.btn {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.btn-outline {
  @apply border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white;
}
</style>
