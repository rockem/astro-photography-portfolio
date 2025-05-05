import { beforeAll, describe, it } from 'vitest';
import { execa } from 'execa';
import path from 'path';
import { promises as fs } from 'fs';
import { type GalleryData, loadGallery } from '../galleryData.ts';
import { expectContainsOnlyObjectsWith } from './expect_util.ts';

const testGalleryPath = 'src/data/__tests__/gallery';
const testGalleryYaml = path.join('src/data/__tests__/gallery', 'gallery.yaml');
const scriptPath = path.resolve(__dirname, '../gallery-generator.ts');

describe('Test Gallery Generator', () => {
	let gallery: GalleryData;

	beforeAll(async () => {
		await fs.rm(path.join(testGalleryYaml), { force: true });
		await execa('npx', ['tsx', scriptPath, testGalleryPath]);
		gallery = await loadGallery(testGalleryYaml);
	});

	it('should add directories as collections', async () => {
		expectContainsOnlyObjectsWith(gallery.collections, [
			{ id: 'kuku' },
			{ id: 'popo' },
		]);
	});

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
			{ path: 'landscape.jpg' },
		]);
	});

	it('should add images name and description', async () => {
		expectContainsOnlyObjectsWith(gallery.images, [
			{ meta: { title: 'Kuku Trees', description: '' } },
			{ meta: { title: 'Popo View', description: '' } },
			{ meta: { title: 'Landscape', description: '' } },
		]);
	});

	it('should add images to collection by directory', async () => {
		expectContainsOnlyObjectsWith(gallery.images, [
			{ path: 'kuku/kuku-trees.jpg', meta: { collections: ['kuku'] } },
			{ path: 'popo/popo-view.jpg', meta: { collections: ['popo'] } },
			{ path: 'landscape.jpg', meta: { collections: [] } },
		]);
	});
});
