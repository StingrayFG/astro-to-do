/// <reference types='vitest' />
import { getViteConfig } from 'astro/config';
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'

export default getViteConfig({
    // plugins: [svelte(), svelteTesting()],
    plugins: [svelteTesting()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest-setup.ts'],
    },
});