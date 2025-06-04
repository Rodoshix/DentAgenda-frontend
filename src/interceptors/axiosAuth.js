import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 👉 Inserta el access_token antes de cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
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

        // Actualiza el header y reintenta
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
  router.push('/')
}

export default api