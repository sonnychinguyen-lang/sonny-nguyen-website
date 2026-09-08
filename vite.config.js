import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sonny-nguyen-website/',
  optimizeDeps: { exclude: ['maplibre-gl'] },
})
