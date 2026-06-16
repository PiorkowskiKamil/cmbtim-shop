import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/cmbtim-shop/', // GH Pages project site lives under /<repo>/
  plugins: [react(), tailwindcss()],
})
