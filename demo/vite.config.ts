import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

const root = path.dirname(fileURLToPath(import.meta.url));
const libRoot = path.resolve(root, '..');

export default defineConfig({
	root,
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: 'altum/icons',
				replacement: path.join(libRoot, 'dist/entries/icons.js')
			},
			{
				find: 'altum/locales',
				replacement: path.join(libRoot, 'dist/entries/locales.js')
			},
			{
				find: 'altum/hooks',
				replacement: path.join(libRoot, 'dist/entries/hooks.js')
			},
			{
				find: 'altum/utils',
				replacement: path.join(libRoot, 'dist/entries/utils.js')
			},
			{
				find: 'altum',
				replacement: path.join(libRoot, 'dist/index.js')
			},
		],
		dedupe: ['react', 'react-dom'],
	},
	server: {
		port: 5173,
		fs: {
			allow: [libRoot],
		},
	},
	build: {
		outDir: path.join(libRoot, 'dist-demo'),
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: path.join(root, 'index.html'),
				layers: path.join(root, 'layers.html'),
			},
		},
	},
	optimizeDeps: {
		exclude: ['altum'],
	},
});
