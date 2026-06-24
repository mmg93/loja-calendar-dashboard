import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// IMPORTANT: `base` must match the GitHub repository name so assets resolve under
// https://USUARIO.github.io/NOME_DO_REPOSITORIO/.
// If you rename the repo, change this value (keep the leading and trailing slash).
// For a user/organization page (USUARIO.github.io) or a custom domain at the root,
// set base to '/'.
export default defineConfig({
  base: '/loja-calendar-dashboard/',
  plugins: [react(), tailwindcss()],
})
