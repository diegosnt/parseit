import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // La raíz es el directorio actual
  root: './',
  // Los archivos estáticos están en public/
  publicDir: 'public',
  build: {
    // El build va a parar a dist/
    outDir: 'dist',
    // Limpiar antes de buildear
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        clase2: resolve(__dirname, 'clase2.html'),
      },
    },
  },
  server: {
    // Puerto por defecto de Vite
    port: 5173,
    // Proxy para las funciones de Cloudflare si las necesitás localmente
    // (Aunque wrangler se encarga de eso en el puerto 8788)
    proxy: {
      '/api': 'http://localhost:8788'
    }
  }
});
