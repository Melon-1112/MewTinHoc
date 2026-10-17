import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { botpressMiddleware } from './server/botpressMiddleware.js'

// https://vite.dev/config/
export default defineConfig({
  base: '/MewTinHoc/',
  plugins: [
    react(),
    {
      name: 'botpress-backend-api',
      configureServer(server) {
        server.middlewares.use('/api/botpress', botpressMiddleware);
        server.middlewares.use('/MewTinHoc/api/botpress', botpressMiddleware);
      }
    }
  ],
  build: {
    cssMinify: false,
  },
})
