import { defineStore } from 'pinia'

interface Usuario {
  rut: string
  rol: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    usuario: null as Usuario | null
  }),
  actions: {
    setAuth(token: string, usuario: Usuario) {
      this.token = token
      this.usuario = usuario
    },
    clearAuth() {
      this.token = ''
      this.usuario = null
    }
  }
})
