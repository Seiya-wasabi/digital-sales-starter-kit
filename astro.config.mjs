import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://digital-sales-starter-kit.pages.dev',
  build: {
    format: 'directory',
  },
  vite: {
    optimizeDeps: {
      exclude: ['js-yaml'],
    },
  },
});
