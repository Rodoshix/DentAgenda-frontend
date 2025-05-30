<template>
  <div class="login-page">
    <h1>Iniciar sesión</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Correo" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const login = () => {
  // Aquí iría la lógica de autenticación
  console.log('Iniciando sesión con', email.value, password.value)
}
</script>

<style scoped>
.login-page {
  padding: 2rem;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
  padding: 0.5rem;
  font-weight: bold;
}
</style>
