<template>
  <section class="section is-flex is-justify-content-center is-align-items-center paciente-background">
    <div class="box perfil-card">
      <div class="has-text-centered mb-5">
        <span class="icon is-large has-text-primary">
          <i class="fas fa-user-circle fa-3x"></i>
        </span>
        <h1 class="title is-4 has-text-info mt-2">Perfil del Paciente</h1>
      </div>

      <div v-if="perfil" class="perfil-datos">
        <p><strong> RUT :</strong> {{ perfil.rut }}</p>
        <p><strong> Nombre :</strong> {{ perfil.nombre }}</p>
        <p><strong> Correo :</strong> {{ perfil.correo }}</p>
        <p><strong> Teléfono :</strong> {{ perfil.telefono }}</p>
        <p><strong> Rol :</strong> {{ perfil.rol }}</p>
      </div>

      <div class="has-text-centered mt-5">
        <button class="button is-danger is-light" @click="logout">
          <i class="fas fa-sign-out-alt mr-2"></i> Cerrar sesión
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import api from '@/interceptors/axiosAuth'

export default {
  data() {
    return {
      perfil: null,
      error: null
    }
  },
  mounted() {
    this.obtenerPerfil()
  },
  methods: {
    async obtenerPerfil() {
      try {
        const response = await api.get('/usuarios/perfil')
        this.perfil = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar perfil'
      }
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('rol')
      this.$router.push('/')
    }
  }
}
</script>


<style scoped>
.paciente-background {
  position: relative;
  background: linear-gradient(to right, #4fc3f7, #0288d1);
  min-height: 100vh;
}

@keyframes auroraPaciente {
  0% {
    background-position: 40% 60%, 60% 40%, 50% 90%;
  }
  50% {
    background-position: 50% 50%, 50% 50%, 50% 80%;
  }
  100% {
    background-position: 40% 60%, 60% 40%, 50% 90%;
  }
}

.paciente-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: white;
}

.perfil-card {
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.07);
  color: #e2e8f0;
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
}

.perfil-datos p {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.perfil-datos strong {
  color: #3a447e;
}

</style>