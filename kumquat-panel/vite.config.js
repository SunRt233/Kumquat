import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: "http://localhost:3300",
        changeOrigin: true
      }
    },
    watch: {
      usePolling: true
    }
  },
  define: {
    __HOST__NAME: "123"
  }
})
