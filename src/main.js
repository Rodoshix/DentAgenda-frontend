import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'bulma/css/bulma.min.css'
import axios from 'axios'
import 'animate.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})