import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server:{
    proxy:{
      '/api':{
        target:'http://159.75.169.224:1235',
        changeOrigin:true
      },
      '/files':{
        target:'http://159.75.169.224:1235',
        changeOrigin:true
      }
    }
  }
})
