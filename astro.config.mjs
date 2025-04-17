// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['node:async_hooks'],
    },
  },

  adapter: node({
    mode: 'standalone',
  }),

  experimental: {
    session: true,
  },

  output: 'server',
});