import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    // if there are local certificates, run over HTTPS (needed for Facebook login)
    https: (function () {
      try {
        return {
          key: require('fs').readFileSync('certs/localhost-key.pem'),
          cert: require('fs').readFileSync('certs/localhost-crt.pem')
        };
      } catch (e) {
        // certificates not found – fall back to http
        return false;
      }
    })()
  }
})
