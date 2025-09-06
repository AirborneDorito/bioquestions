// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isPages = process.env.VITE_PAGES === '1';

export default defineConfig({
  plugins: [react()],
  base: isPages ? '/bioquestions/' : '/',   // local preview uses '/'
  build: {
    outDir: isPages ? 'docs' : 'dist',
  },
});
