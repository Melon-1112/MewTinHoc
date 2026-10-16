import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Website-Tin-h-c-THPTQG/',
  plugins: [react()],
  build: {
    cssMinify: false,
  },
})
