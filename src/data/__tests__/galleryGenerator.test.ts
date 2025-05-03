import { beforeAll, describe, expect, it } from 'vitest';
import { execa } from 'execa';
import path from 'path';
import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import type { GalleryData } from '../gallerySchema.ts';
import { expectContainsOnlyObjectsWith } from './expect_util.ts';

const testGalleryPath = 'src/data/__tests__/gallery';
const testGalleryYaml = path.join('src/data/__tests__/gallery', 'gallery.yaml');
const scriptPath = path.resolve(__dirname, '../gallery-generator.ts');

describe('Test Gallery Generator', () => {
	let gallery: GalleryData;

	beforeAll(async () => {
		await fs.rm(path.join(testGalleryYaml), { force: true });
		await execa('npx', ['tsx', scriptPath, testGalleryPath]);
		gallery = await loadGalleryDataFrom(testGalleryYaml);
	});

	it('should add directories as collections', async () => {
		expectContainsOnlyObjectsWith(gallery.collections, [
			{ id: 'kuku' },
			{ id: 'popo' },
		]);
	});

	async function loadGalleryDataFrom(galleryPath: string) {
		const yamlPath = path.resolve(process.cwd(), galleryPath);
		const content = await fs.readFile(yamlPath, 'utf8');
		return yaml.load(content) as GalleryData;
	}

	it('should add collection camel case names', async () => {
		expectContainsOnlyObjectsWith(gallery.collections, [
			{ name: 'Kuku' },
			{ name: 'Popo' },
		]);
	});

	it('should add images path', async () => {
		expectContainsOnlyObjectsWith(gallery.images, [
			{ path: 'kuku/kuku-trees.jpg' },
			{ path: 'popo/popo-view.jpg' },
		]);
	});

	it('should add images name and description', async () => {
		expectContainsOnlyObjectsWith(gallery.images, [
			{ meta: { title: 'Kuku Trees', description: '' } },
			{ meta: { title: 'Popo View', description: '' } },
		]);
	});

	it('should add images to collection by directory', async () => {
		gallery.images.forEach((image) => {
			expect(image.meta.collections).toContain(path.dirname(image.path));
		});
	});
});
