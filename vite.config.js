import { defineConfig } from 'vite';

const repoName = 'PixelDiet';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/',
});
