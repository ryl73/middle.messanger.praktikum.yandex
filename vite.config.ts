import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	root: resolve(__dirname, 'src'),
	publicDir: resolve(__dirname, 'public'),
	build: {
		outDir: resolve(__dirname, 'dist'),
	},
	server: {
		port: 3000,
	},
	preview: {
		port: 3000,
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
