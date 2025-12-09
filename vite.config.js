// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Force le port 5173
    strictPort: true, // Échoue si le port est pris (important pour Electron)
  },
});