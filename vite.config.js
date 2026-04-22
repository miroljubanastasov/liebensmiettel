import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    host: true, // expose on LAN so phone can access
    proxy: {
      // Proxy all Supabase requests through Vite so the browser
      // never makes a plain HTTP fetch from an HTTPS page (mixed content).
      '/supabase-proxy': {
        target: 'http://127.0.0.1:54321',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-proxy/, ''),
        secure: false,
      },
    },
  },
})
