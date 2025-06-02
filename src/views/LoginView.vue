<template>
    <section class="section">
      <div class="container">
        <h1 class="title has-text-centered">DentAgenda - Login</h1>
        <div class="box">
          <form @submit.prevent="login">
            <div class="field">
              <label class="label">RUT</label>
              <div class="control">
                <input class="input" v-model="rut" type="text" placeholder="12345678-9" required />
              </div>
            </div>
  
            <div class="field">
              <label class="label">Contraseña</label>
              <div class="control">
                <input class="input" v-model="password" type="password" required />
              </div>
            </div>
  
            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <button class="button is-link">Ingresar</button>
              </div>
            </div>
  
            <p class="has-text-danger" v-if="error">{{ error }}</p>
          </form>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        rut: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:8080/api/auth/login', {
            rut: this.rut,
            password: this.password
          })
          const { rol, token } = response.data
          localStorage.setItem('token', token)
          if (rol === 'PACIENTE') this.$router.push('/paciente')
          else if (rol === 'RECEPCIONISTA') this.$router.push('/recepcionista')
          else if (rol === 'ODONTOLOGO') this.$router.push('/odontologo')
          else if (rol === 'ADMINISTRADOR') this.$router.push('/admin')
        } catch (err) {
          this.error = 'Credenciales inválidas'
        }
      }
    }
  }
  </script>