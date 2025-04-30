import { beforeAll, describe, expect, it } from 'vitest';
import { execa } from 'execa';
import path from 'path';
import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import type { Collection, GalleryData } from '../gallerySchema.ts';

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
		const collectionIds = gallery.collections.map((col: Collection) => col.id);

		expect(collectionIds).toHaveLength(2);
		expect(collectionIds).toContain('kuku');
		expect(collectionIds).toContain('popo');
	});

	async function loadGalleryDataFrom(galleryPath: string) {
		const yamlPath = path.resolve(process.cwd(), galleryPath);
		const content = await fs.readFile(yamlPath, 'utf8');
		return yaml.load(content) as GalleryData;
	}

	it('should add collection names', async () => {
		const collectionNames = gallery.collections.map(
			(col: Collection) => col.name,
		);

		expect(collectionNames).toHaveLength(2);
		expect(collectionNames).toContain('Kuku');
		expect(collectionNames).toContain('Popo');
	});

	it('should add images path', async () => {
		const images = gallery.images;

		const imagesPath = images.map((img) => img.path);

		expect(imagesPath).toHaveLength(2);
		expect(imagesPath).toContain('kuku/kuku-trees.jpg');
		expect(imagesPath).toContain('popo/popo-view.jpg');
	});

	it('should add images name and description', async () => {
		const images = gallery.images;

		expect(images).toHaveLength(2);
		expect(images).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ title: 'Kuku Trees', description: '' }),
				expect.objectContaining({ title: 'Popo View', description: '' }),
			]),
		);
	});
});
