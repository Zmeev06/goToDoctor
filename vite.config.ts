import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": require("path").resolve(__dirname, "src"),
      "@components": "/src/components/",
      "@pages": "/src/pages/",
      "@shared": "/src/components/shared/",
      "@assets": "/src/assets/",
    },
  },
})
