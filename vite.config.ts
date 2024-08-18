import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: '0.0.0.0',
		port: 80
	},
	preview: {
		host: '0.0.0.0',
		port: 80
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
