import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom domain calendariobeitel.online — assets resolve from the root.
// If you ever remove the custom domain, change base back to '/loja-calendar-dashboard/'.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
