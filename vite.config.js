import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures build paths are relative for local file preview
  server: {
    port: 3000,
    open: true
  }
})
