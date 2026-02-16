import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hsm-safety-app/', // Ensure relative paths for GH Pages deployment
  server: {
    proxy: {
      '/api/nhtsa': {
        target: 'https://crashviewer.nhtsa.dot.gov/CrashAPI',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nhtsa/, ''),
        secure: false
      }
    }
  }
});
