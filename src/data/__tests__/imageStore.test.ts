import { describe, expect, test } from 'vitest';
import kukuTrees from './gallery/kuku/kuku-trees.jpg';
import popoView from './gallery/popo/popo-view.jpg';
import {
	getCollections,
	getImagesByCollection,
	ImageStoreError,
} from '../imageStore.ts';

const { getImages } = await import('../imageStore.ts');

const testGalleryPath = 'src/data/__tests__/gallery/gallery.yaml';

const invalidGalleryPath =
	'src/data/__tests__/gallery/invalid-collection-gallery.yaml';

describe('Images Store', () => {
	test('should retrieve all present images', async () => {
		const imagesData = await getImages(testGalleryPath);
		expect(imagesData).toHaveLength(2);
		expect(imagesData[0].src).toEqual(kukuTrees);
		expect(imagesData[1].src).toEqual(popoView);
	});

	test('should retrieve only featured images', async () => {
		const images = await getImagesByCollection('featured', testGalleryPath);
		expect(images).toHaveLength(1);
		expect(images[0].title).toEqual('Popo View');
	});

	test('should retrieve images of specific collection', async () => {
		const images = await getImagesByCollection('popo', testGalleryPath);
		expect(images).toHaveLength(1);
		expect(images[0].description).toContain('popo album');
	});
	test('should fail on getting a collection with invalid gallery yaml', async () => {
		await expect(
			getImagesByCollection('kuku', invalidGalleryPath),
		).rejects.toThrow(ImageStoreError);
	});

	test('should retrieve all collection names', async () => {
		const collections = await getCollections(testGalleryPath);
		expect(collections).toHaveLength(2);
		expect(collections[0].id).toEqual('kuku');
		expect(collections[0].name).toEqual('Kuku');
		expect(collections[1].id).toEqual('popo');
		expect(collections[1].name).toEqual('Popo');
	});

	test('should fail on a missing gallery file', async () => {
		await expect(getImages(invalidGalleryPath)).rejects.toThrow(
			ImageStoreError,
		);
	});

	test('should fail on invalid gallery file', async () => {
		const galleryPath = 'src/data/__tests__/gallery/invalid-gallery.yaml';
		await expect(getImages(galleryPath)).rejects.toThrow(ImageStoreError);
	});

	test('should fail on invalid collection', async () => {
		const galleryPath =
			'src/data/__tests__/gallery/invalid-collection-gallery.yaml';
		await expect(getImages(galleryPath)).rejects.toThrow(ImageStoreError);
	});
});
