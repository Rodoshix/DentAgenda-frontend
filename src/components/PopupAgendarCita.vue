<template>
    <div class="popup-card">
      <button class="close-button" @click="$emit('cerrar')">✖</button>
  
      <!-- Mensaje si ya tiene cuenta -->
      <template v-if="mostrarMensaje && tipoMensaje === 'cuenta-existe'">
        <h2 class="popup-title">Cuenta existente</h2>
        <p>{{ mensaje }}</p>
        <button class="popup-action" @click="router.push('/login')">Iniciar sesión</button>
      </template>
    
      <!-- 🎉 Mensaje tras registro -->
      <template v-else-if="mostrarMensaje && tipoMensaje === 'registro-ok'">
        <h2 class="popup-title">¡Registro exitoso!</h2>
        <p>Gracias por registrarte, {{ nombre.value }}.</p>
        <button class="popup-action" @click="router.push('/login')">Iniciar sesión</button>
      </template>
    
      <!-- Formulario nuevo paciente -->
      <template v-else-if="mostrarSoloPassword">
        <h2 class="popup-title">Activar cuenta</h2>
        <input type="password" class="popup-input" v-model="password" placeholder="Crea una contraseña" />
        <input type="password" class="popup-input" v-model="confirmarPassword" placeholder="Confirma tu contraseña" />
        <p v-if="errorMensaje" class="error-text">{{ errorMensaje }}</p>
        <button class="popup-action" @click="activarCuenta">Crear Cuenta</button>
      </template>
      <template v-else-if="mostrarFormulario">
        <h2 class="popup-title">Registro de Paciente</h2>
        <input type="text" class="popup-input" v-model="nombre" placeholder="Nombre completo" />
        <input type="email" class="popup-input" v-model="correo" placeholder="Correo electrónico" />
        <input type="text" class="popup-input" v-model="telefono" placeholder="Teléfono : Ej 912345678" />
        <input type="password" class="popup-input" v-model="password" placeholder="Crea una contraseña" />

        <p v-if="errorMensaje" class="error-text">{{ errorMensaje }}</p>

        <button class="popup-action" @click="crearCuentaPaciente" :disabled="creando">
          {{ creando ? 'Registrando...' : 'Registrarme' }}
        </button>
      </template>
  
      <!-- Primer paso: ingresar RUT -->
      <template v-else>
        <h2 class="popup-title">Agendar Cita</h2>
        <label>Ingresa tu RUT:</label>
        <input v-model="rut" type="text" placeholder="12345678-9" class="popup-input" />
        <p v-if="errorMensaje" class="error-text">{{ errorMensaje }}</p>
        <button class="popup-action" @click="verificarRut">Continuar</button>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const rut = ref('')
  const nombre = ref('')
  const correo = ref('')
  const telefono = ref('')
  const password = ref('')

  const mostrarFormulario = ref(false)
  const creando = ref(false)
  const mostrarMensaje = ref(false)
  const tipoMensaje = ref('')
  const mensaje = ref('')

  const router = useRouter()

  const errorMensaje = ref('')
  
  const mostrarSoloPassword = ref(false)
  const confirmarPassword = ref('')

  function cerrarPopup() {
    limpiarTodo()
    // Emite al padre el cierre
    emit('cerrar')
    }

    const emit = defineEmits(['cerrar'])

    function limpiarTodo() {
    rut.value = ''
    nombre.value = ''
    correo.value = ''
    telefono.value = ''
    password.value = ''
    mostrarFormulario.value = false
    mostrarMensaje.value = false
    tipoMensaje.value = ''
    mensaje.value = ''
    }

  async function verificarRut() {
    errorMensaje.value = ''
    if (!rutValido(rut.value)) {
    errorMensaje.value = 'El RUT ingresado no tiene un formato válido. Ej: 12345678-9 o 1234567-K'
    return
    }
    function rutValido(rutStr) {
    const regex = /^[0-9]{7,8}-[0-9kK]$/
    return regex.test(rutStr)
    }

    try {
      const res = await fetch(`http://localhost:8080/api/pacientes/${rut.value}`)
      if (res.ok) {
        const paciente = await res.json()
  
        if (paciente.usuario && paciente.usuario.password) {
        mensaje.value = 'Este paciente ya tiene una cuenta registrada.'
        mostrarMensaje.value = true
    } else if (paciente.nombre) {
        // registrado por recepcionista, guardamos los datos
        nombre.value = paciente.nombre
        correo.value = paciente.correo
        telefono.value = paciente.telefono
        mostrarSoloPassword.value = true
    } else {
        mostrarFormulario.value = true
        }
      } else {
        mostrarFormulario.value = true
      }
    } catch (error) {
      console.error('Error al verificar rut:', error)
      alert('Hubo un problema al verificar el RUT.')
    }
  }
  
    async function activarCuenta() {
    errorMensaje.value = ''

    if (!password.value || !confirmarPassword.value) {
        errorMensaje.value = 'Debes ingresar y confirmar la contraseña.'
        return
    }

    if (password.value !== confirmarPassword.value) {
        errorMensaje.value = 'Las contraseñas no coinciden.'
        return
    }

    const payload = {
       rut: rut.value,
       password: password.value,
       nombre: nombre.value,
       correo: correo.value,
       telefono: telefono.value
    }

    try {
        const res = await fetch('http://localhost:8080/api/pacientes/crear-cuenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
        })

        if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Error al crear cuenta')
        }

        tipoMensaje.value = 'registro-ok'
        mostrarSoloPassword.value = false
        mostrarMensaje.value = true

    } catch (error) {
        errorMensaje.value = error.message
    }
    }

  async function crearCuentaPaciente() {
    errorMensaje.value = ''
    if (!nombre.value || !correo.value || !telefono.value || !password.value) {
    errorMensaje.value = 'Por favor completa todos los campos.'
    return
    }
  
    creando.value = true
  
    const payload = {
      rut: rut.value,
      nombre: nombre.value,
      correo: correo.value,
      telefono: telefono.value,
      password: password.value
    }
  
    try {
      const res = await fetch('http://localhost:8080/api/pacientes/crear-cuenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
  
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Error al registrar paciente')
      }
  
      // ✅ Mostrar mensaje personalizado
        tipoMensaje.value = 'registro-ok'
        mostrarFormulario.value = false
        mostrarMensaje.value = true
        } catch (error) {
             errorMensaje.value = error.message || 'Ocurrió un error al registrar.'
        } finally {
        creando.value = false
        }
    }
  </script>
  
  <style scoped>

    .error-text {
    color: #d32f2f;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    }

  .popup-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 350px;
    max-width: 90vw;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    text-align: center;
    position: relative;
  }
  
  .popup-title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    color: #0288d1;
  }
  
  .popup-input {
    padding: 0.5rem;
    width: 100%;
    margin: 0.5rem 0;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  
  .popup-action {
    background-color: #0288d1;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 0.5rem;
  }
  
  .popup-action:hover {
    background-color: #0277bd;
  }
  
  .close-button {
    background: none;
    border: none;
    position: absolute;
    top: 10px;
    right: 14px;
    font-size: 18px;
    cursor: pointer;
  }
  </style>