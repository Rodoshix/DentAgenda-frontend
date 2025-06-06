import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'  // 👈 Importa 'path' de Node.js

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 Define alias '@' como la carpeta 'src'
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080' // 👈 Esto redirige las llamadas al backend
    }
  }
})