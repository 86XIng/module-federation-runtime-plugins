/// <reference types="vite/client" />

import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		target: 'es2015',
		emptyOutDir: true,
		sourcemap: true,
		cssCodeSplit: false,
		outDir:  './dist',
		lib: {
			entry: './src/index.ts',
			name: 'index',
			fileName: (format) => `index.${format}.js`
		},
		rollupOptions: {
			output: { exports: 'named' }
		}
	},
});
