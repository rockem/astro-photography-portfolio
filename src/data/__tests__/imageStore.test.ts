import { describe, expect, it } from 'vitest';
import kukuTrees from './gallery/kuku/kuku-trees.jpg';
import popoView from './gallery/popo/popo-view.jpg';
import landscape from './gallery/landscape.jpg';
import { getCollections, getImagesByCollection, ImageStoreError } from '../imageStore.ts';

const { getImages } = await import('../imageStore.ts');

const GALLERY = {
	VALID: 'src/data/__tests__/gallery/valid-gallery.yaml',
	INVALID: 'src/data/__tests__/gallery/invalid-gallery.yaml',
	MISSING: 'src/data/__tests__/gallery/no-gallery.yaml',
	INVALID_COLLECTION: 'src/data/__tests__/gallery/invalid-collection-gallery.yaml',
};

describe('Images Store', () => {
	it('should retrieve all present images', async () => {
		const imagesData = await getImages(GALLERY.VALID);
		expect(imagesData).toHaveLength(3);
		expect(imagesData[0].src).toEqual(kukuTrees);
		expect(imagesData[1].src).toEqual(popoView);
		expect(imagesData[2].src).toEqual(landscape);
	});

	it('should retrieve images of specific collection', async () => {
		const images = await getImagesByCollection('featured', GALLERY.VALID);
		expect(images).toHaveLength(2);
		expect(images[0].src).toEqual(popoView);
		expect(images[1].src).toContain(landscape);
	});

	it('should retrieve title & description', async () => {
		const images = await getImagesByCollection('popo', GALLERY.VALID);
		expect(images).toHaveLength(1);
		expect(images[0].title).toEqual('Popo View');
		expect(images[0].description).toContain('popo album');
	});

	it('should fail on getting a collection with invalid gallery yaml', async () => {
		await expect(getImagesByCollection('kuku', GALLERY.INVALID)).rejects.toThrow(ImageStoreError);
	});

	it('should retrieve all collection names', async () => {
		const collections = await getCollections(GALLERY.VALID);
		expect(collections).toHaveLength(2);
		expect(collections[0].id).toEqual('kuku');
		expect(collections[0].name).toEqual('Kuku');
		expect(collections[1].id).toEqual('popo');
		expect(collections[1].name).toEqual('Popo');
	});

	it('should fail on a missing gallery file', async () => {
		await expect(getImages(GALLERY.MISSING)).rejects.toThrow(ImageStoreError);
	});

	it('should fail on invalid gallery file', async () => {
		await expect(getImages(GALLERY.INVALID)).rejects.toThrow(ImageStoreError);
	});

	it('should fail on invalid collection', async () => {
		await expect(getImages(GALLERY.INVALID_COLLECTION)).rejects.toThrow(ImageStoreError);
	});
});
