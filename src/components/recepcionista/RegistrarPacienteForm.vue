<template>
  <div class="box">
    <h2 class="title is-4">Registrar Nuevo Paciente</h2>

    <form @submit.prevent="registrarPaciente">
      <div class="field">
        <label class="label">Nombre completo</label>
        <div class="control">
          <input class="input" type="text" v-model="paciente.nombre" required />
        </div>
      </div>

      <div class="field">
        <label class="label">RUT</label>
        <div class="control">
          <input class="input" type="text" v-model="paciente.rut" placeholder="12345678-9" required />
          <p class="help is-danger" v-if="errores.rut">{{ errores.rut }}</p>
        </div>
      </div>

      <div class="field">
        <label class="label">Correo</label>
        <div class="control">
          <input class="input" type="email" v-model="paciente.correo" required />
          <p class="help is-danger" v-if="errores.correo">{{ errores.correo }}</p>
        </div>
      </div>

      <div class="field">
        <label class="label">Teléfono</label>
        <div class="control">
          <input class="input" type="tel" v-model="paciente.telefono" required />
          <p class="help is-danger" v-if="errores.telefono">{{ errores.telefono }}</p>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-primary" :disabled="cargando">Registrar</button>
        </div>
      </div>

      <div v-if="mensaje" class="notification is-success mt-3">
        {{ mensaje }}
      </div>
      <div v-if="error" class="notification is-danger mt-3">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../interceptors/axiosAuth'

const paciente = ref({
  nombre: '',
  rut: '',
  correo: '',
  telefono: ''
})

const mensaje = ref('')
const error = ref('')
const cargando = ref(false)

const registrarPaciente = async () => {
  mensaje.value = ''
  error.value = ''

  if (!validarTodo()) {
    error.value = 'Revisa los datos ingresados.'
    return
  }

  cargando.value = true
  try {
    const response = await api.post('/pacientes/registro', paciente.value)
    mensaje.value = 'Paciente registrado con éxito.'
    paciente.value = { nombre: '', rut: '', correo: '', telefono: '' }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      error.value = 'El RUT ya están registrados.'
    } else {
      error.value = 'Ocurrió un error al registrar el paciente.'
    }
  } finally {
    cargando.value = false
  }
}

const errores = ref({
  rut: '',
  correo: '',
  telefono: ''
})

const validarRut = (rut) => {
  const rutRegex = /^[0-9]{7,8}-[0-9kK]$/
  if (!rutRegex.test(rut)) {
    errores.value.rut = 'RUT inválido. Usa formato 12345678-9'
    return false
  }
  errores.value.rut = ''
  return true
}

const validarCorreo = (correo) => {
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!correoRegex.test(correo)) {
    errores.value.correo = 'Correo electrónico inválido'
    return false
  }
  errores.value.correo = ''
  return true
}

const validarTelefono = (telefono) => {
  const telefonoRegex = /^[0-9]{9}$/
  if (!telefonoRegex.test(telefono)) {
    errores.value.telefono = 'Teléfono debe tener 9 dígitos'
    return false
  }
  errores.value.telefono = ''
  return true
}

const validarTodo = () => {
  const rutOk = validarRut(paciente.value.rut)
  const correoOk = validarCorreo(paciente.value.correo)
  const fonoOk = validarTelefono(paciente.value.telefono)
  return rutOk && correoOk && fonoOk
}

</script>