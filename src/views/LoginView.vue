<template>
  <section class="hero is-fullheight login-background">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="login-box box">
          <figure class="image is-96x96 is-inline-block mb-4">
            <img src="https://i.imgur.com/2yaf2wb.png" alt="Avatar" class="is-rounded" />
          </figure>
          <form @submit.prevent="login">
            <div class="field">
              <p class="control has-icons-left">
                <input class="input" type="text" placeholder="RUT" v-model="rut" required />
                <span class="icon is-small is-left">
                  <i class="fas fa-id-card"></i>
                </span>
              </p>
            </div>

            <!-- Contraseña -->
            <div class="field">
              <div class="control has-icons-left has-icons-right">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="input"
                  placeholder="Contraseña"
                  v-model="password"
                  required
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-lock"></i>
                </span>
                <span class="icon is-small is-right" style="pointer-events: auto;">
                  <i
                    :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    @click="togglePassword"
                    class="clickable-eye"
                  ></i>
                </span>
              </div>
            </div>

            <div class="field is-flex is-justify-content-space-between">
              <label class="checkbox has-text-white">
                <input type="checkbox" v-model="recordarRut" /> Recuérdame
              </label>
              <a class="has-text-white is-size-7">¿Olvidaste tu contraseña?</a>
            </div>

            <div class="field mt-5">
              <button class="button is-fullwidth is-bold login-button">
                INICIAR SESIÓN
              </button>
            </div>

            <p v-if="error" class="has-text-danger mt-2">{{ error }}</p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '@/interceptors/axiosAuth'

export default {
  data() {
    return {
      rut: '',
      password: '',
      showPassword: false,
      recordarRut: false,
      error: ''
    }
  },

  mounted() {
  const rutGuardado = localStorage.getItem('rutRecordado')
  if (rutGuardado) {
    this.rut = rutGuardado
    this.recordarRut = true
  }
  },
  
    methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    async login() {
      try {
        const response = await api.post('/auth/login', {
          rut: this.rut.trim(),
          password: this.password.trim()
        })

        const { access_token, refresh_token, rol } = response.data
        localStorage.setItem('token', access_token)
        if (this.recordarRut) {
          localStorage.setItem('rutRecordado', this.rut)
        } else {
          localStorage.removeItem('rutRecordado')
        }
        localStorage.setItem('refresh_token', refresh_token)
        localStorage.setItem('rol', rol)

        this.error = ''

        if (rol === 'PACIENTE') this.$router.push('/paciente')
        else if (rol === 'RECEPCIONISTA') this.$router.push('/recepcionista')
        else if (rol === 'ODONTOLOGO') this.$router.push('/odontologo')
        else if (rol === 'ADMINISTRADOR') this.$router.push('/admin')

      } catch (err) {
        console.error('Error login:', err.response?.data || err.message)
        this.error = err.response?.data?.message || 'Contraseña incorrecta'
      }
    }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
@keyframes auroraDark {
  0% {
    background-position: 40% 60%, 60% 40%, 50% 90%;
  }
  25% {
    background-position: 45% 55%, 55% 45%, 50% 85%;
  }
  50% {
    background-position: 50% 50%, 50% 50%, 50% 80%;
  }
  75% {
    background-position: 55% 45%, 45% 55%, 50% 85%;
  }
  100% {
    background-position: 40% 60%, 60% 40%, 50% 90%;
  }
}
.login-background {
  position: relative;
  background: linear-gradient(to right, #4fc3f7, #0288d1); /* mismo efecto */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  max-width: 360px;
  margin: auto;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1); /* más claro que el fondo */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); /* sombra más marcada */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 255, 255, 0.25); /* borde claro sutil */
}

.login-button {
  background-image: linear-gradient(135deg, #2f2a60, #602040);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.password-toggle {
  cursor: pointer;
  pointer-events: auto;
}

.clickable-eye {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.clickable-eye:hover {
  transform: scale(1.2);
}

.login-button:hover {
  transform: scale(1.03);
  background-image: linear-gradient(135deg, #443c7d, #7d3a58);
  box-shadow: 0 6px 20px rgba(128, 96, 160, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.input {
  background: rgba(0, 72, 186, 0.15);
  border: none;
  color: #fff;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.input:focus {
  border: none;
  box-shadow: 0 0 0 2px #4d9eff;
}

.login-button {
  background-image: linear-gradient(to right, #2193b0, #6dd5ed);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
}
</style>