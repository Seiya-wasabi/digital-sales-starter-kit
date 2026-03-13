import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://your-site.pages.dev',
  build: {
    format: 'directory',
  },
  vite: {
    optimizeDeps: {
      exclude: ['js-yaml'],
    },
  },
});
