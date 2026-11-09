import { defineConfig } from 'vite';

export default defineConfig({
  base: './',              // relative asset paths, so dist/ works on GitHub Pages or any sub-folder
  server: { open: true },  // open the browser on `npm run dev`
  build: { target: 'es2020' },
});
