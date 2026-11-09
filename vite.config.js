import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa: funciona en GitHub Pages (/cafeteria-online/) y en un dominio propio.
export default defineConfig({
  plugins: [react()],
  base: './',
})
