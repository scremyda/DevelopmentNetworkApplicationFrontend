import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // string shorthand: http://localhost:3000/api -> http://localhost:8080/api
      '/api': 'http://localhost:8080',
    },
  },
})
