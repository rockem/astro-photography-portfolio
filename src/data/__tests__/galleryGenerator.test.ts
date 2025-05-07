import { beforeAll, describe, expect, it } from 'vitest';
import { execa } from 'execa';
import path from 'path';
import * as fs from 'node:fs';
import { type GalleryData, type GalleryImage, loadGallery } from '../galleryData.ts';
import { expectContainsOnlyObjectsWith } from './expect_util.ts';
import yaml from 'js-yaml';

const testGalleryPath = 'src/data/__tests__/gallery';
const testGalleryYaml = path.join('src/data/__tests__/gallery', 'gallery.yaml');
const scriptPath = path.resolve(__dirname, '../gallery-generator.ts');

describe('Test Gallery Generator', () => {
	let gallery: GalleryData;

	beforeAll(async () => {
		await fs.promises.rm(path.join(testGalleryYaml), { force: true });
		await generateGallery();
	});

	async function generateGallery() {
		await execa('npx', ['tsx', scriptPath, testGalleryPath]);
		gallery = await loadGallery(testGalleryYaml);
	}

	describe('Collections', () => {
		it('should add directories as collections', () => {
			expectContainsOnlyObjectsWith(gallery.collections, [{ id: 'kuku' }, { id: 'popo' }]);
		});

		it('should add collection camel case names', () => {
			expectContainsOnlyObjectsWith(gallery.collections, [{ name: 'Kuku' }, { name: 'Popo' }]);
		});
	});

	describe('Images', () => {
		it('should add images path', () => {
			expectContainsOnlyObjectsWith(gallery.images, [
				{ path: 'kuku/kuku-trees.jpg' },
				{ path: 'kuku/kuku-bubble.jpg' },
				{ path: 'popo/popo-view.jpg' },
				{ path: 'landscape.jpg' },
			]);
		});

		it('should add images name and description', () => {
			expectContainsOnlyObjectsWith(gallery.images, [
				{ meta: { title: 'Kuku Trees', description: '' } },
				{ meta: { title: 'Kuku Bubble', description: '' } },
				{ meta: { title: 'Popo View', description: '' } },
				{ meta: { title: 'Landscape', description: '' } },
			]);
		});

		it('should add images to collection by directory', () => {
			expectContainsOnlyObjectsWith(gallery.images, [
				{ path: 'kuku/kuku-trees.jpg', meta: { collections: ['kuku'] } },
				{ path: 'kuku/kuku-bubble.jpg', meta: { collections: ['kuku'] } },
				{ path: 'popo/popo-view.jpg', meta: { collections: ['popo'] } },
				{ path: 'landscape.jpg', meta: { collections: [] } },
			]);
		});
	});

	describe('Error handling', () => {
		it('should fail on invalid gallery path', async () => {
			console.error('Invalid directory path provided.');
			await expect(execa('npx', ['tsx', scriptPath, 'invalid-path'])).rejects.toThrow(
				'Invalid directory path provided.',
			);
		});
	});

	describe('Existing gallery', () => {
		it('should not override an existing title and description', async () => {
			const imagePath = 'kuku/kuku-trees.jpg';
			const customTitle = 'Custom Title';
			const customDescription = 'Custom Description';
			await updateGalleryImageMeta(imagePath, {
				title: customTitle,
				description: customDescription,
			});

			await generateGallery();

			const updatedImage = findImageByPath(imagePath);
			expect(updatedImage.meta).toEqual(
				expect.objectContaining({
					title: customTitle,
					description: customDescription,
				}),
			);
		});

		async function updateGalleryImageMeta(path: string, props: Record<string, unknown>) {
			const image = findImageByPath(path);
			image.meta = { ...image.meta, ...props };
			await fs.promises.writeFile(testGalleryYaml, yaml.dump(gallery), 'utf8');
		}

		function findImageByPath(path: string): GalleryImage {
			const image = gallery.images.find((img) => img.path === path);
			if (!image) throw new Error(`Image [${path}] not found`);
			return image;
		}
	});
});
