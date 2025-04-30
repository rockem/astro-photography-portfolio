import { beforeEach, describe, expect, it } from 'vitest';
import { execa } from 'execa';
import path from 'path';
import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import type { Collection, GalleryData } from '../gallerySchema.ts';

const testGalleryPath = 'src/data/__tests__/gallery';
const testGalleryYaml = path.join('src/data/__tests__/gallery', 'gallery.yaml');
const scriptPath = path.resolve(__dirname, '../gallery-generator.ts');

describe('valid gallery generation test', () => {
	beforeEach(async () => {
		await fs.rm(path.join(testGalleryYaml), { force: true });
	});

	it('should add directories as collections', async () => {
		await execa('npx', ['tsx', scriptPath, testGalleryPath]);
		const gallery = await loadGalleryDataFrom(testGalleryYaml);

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
		await execa('npx', ['tsx', scriptPath, testGalleryPath]);
		const gallery = await loadGalleryDataFrom(testGalleryYaml);

		const collectionNames = gallery.collections.map(
			(col: Collection) => col.name,
		);

		expect(collectionNames).toHaveLength(2);
		expect(collectionNames).toContain('Kuku');
		expect(collectionNames).toContain('Popo');
	});
});
