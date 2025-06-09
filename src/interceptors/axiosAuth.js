import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  // 👇 Evitar agregar token en login y refresh
  const isLogin = config.url.includes('/auth/login')
  const isRefresh = config.url.includes('/auth/refresh')

  if (token && !isLogin && !isRefresh) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

// 🔄 Interceptor para manejar errores de token vencido
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Solo actuar si es 401/403 y no es un reintento
    if ((error.response?.status === 401 || error.response?.status === 403)
        && !originalRequest._retry
        && localStorage.getItem('token')
        && localStorage.getItem('refresh_token')) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        limpiarYRedirigir()
        return Promise.reject(error)
      }

      try {
        const response = await axios.post('http://localhost:8080/api/auth/refresh', {
          refreshToken: refreshToken
        })

        const newAccessToken = response.data.access_token
        localStorage.setItem('token', newAccessToken)

        // ✅ ACTUALIZA también el header por defecto de axios
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

        // ✅ Y reintenta la solicitud original
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return api(originalRequest)

      } catch (refreshError) {
        limpiarYRedirigir()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

function limpiarYRedirigir() {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('rol')
  localStorage.removeItem('rut')
  router.push('/')
}

export default api