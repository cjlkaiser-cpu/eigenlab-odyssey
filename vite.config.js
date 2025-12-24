import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      // Permitir servir archivos de EigenLab
      allow: [
        path.resolve(__dirname),
        '/Users/carlos/Projects/EigenLab'
      ]
    }
  },
  resolve: {
    alias: {
      '/eigenlab': '/Users/carlos/Projects/EigenLab'
    }
  }
});
