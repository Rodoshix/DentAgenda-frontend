import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
// import { loginApi } from '@/services/auth' // backend futuro
import { computed } from 'vue'

export function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()

const login = async (rut: string, password: string) => {
  // Simulación de autenticación temporal por usuario y rol
  const usuariosSimulados = [
    { rut: '12345678-9', password: 'clave123', rol: 'PACIENTE' },
    { rut: '11111111-1', password: 'recepcionista', rol: 'RECEPCIONISTA' },
    { rut: '22222222-2', password: 'odontologo', rol: 'ODONTOLOGO' }
  ]

  const usuario = usuariosSimulados.find(
    u => u.rut === rut && u.password === password
  )

  if (!usuario) throw new Error('Credenciales inválidas')

  const mockToken = 'token_de_prueba'
  const { password: _, ...userWithoutPassword } = usuario
  auth.setAuth(mockToken, userWithoutPassword)

  // Redirección por rol
  switch (usuario.rol) {
    case 'PACIENTE':
      router.push('/paciente')
      break
    case 'RECEPCIONISTA':
      router.push('/recepcionista')
      break
    case 'ODONTOLOGO':
      router.push('/odontologo')
      break
    default:
      router.push('/')
  }
}

  const logout = () => {
    auth.clearAuth()
    router.push('/login')
  }

  return {
    login,
    logout,
    isAuthenticated: computed(() => !!auth.token),
    usuario: computed(() => auth.usuario)
  }
}
