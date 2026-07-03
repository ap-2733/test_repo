import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // allow serving files from the workspace root
      allow: ['../..'],
    },
  },
  resolve: {
    // prefer .web.tsx/.web.ts when present, falling back to .tsx/.ts
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.jsx', '.web.js', '.jsx', '.js'],
  },
});