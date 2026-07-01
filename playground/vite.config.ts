import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point to the library source directly for hot-reload during development
      'react-phone-input-pro': resolve(__dirname, '../src/index.ts'),
    },
  },
  root: resolve(__dirname),
  server: {
    port: 5174,
    open: true,
  },
});
