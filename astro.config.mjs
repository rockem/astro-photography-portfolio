// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://astro.build/config
export default defineConfig({
	site: 'https://rockem.github.io',
	base: 'astro-photography-portfolio',
	vite: {
		plugins: [
			tailwindcss(),
			viteStaticCopy({
				targets: [
					{
						src: 'src/gallery/gallery.yaml',
						dest: 'gallery',
					},
				],
			}),
		],
	},
});
