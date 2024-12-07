import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5300,
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
    modules: {
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
})