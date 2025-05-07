import { describe, expect, it } from 'vitest';
import kukuTrees from './gallery/kuku/kuku-trees.jpg';
import popoView from './gallery/popo/popo-view.jpg';
import landscape from './gallery/landscape.jpg';
import { getCollections, getImagesByCollection, ImageStoreError } from '../imageStore.ts';

const { getImages } = await import('../imageStore.ts');

const testGalleryPath = 'src/data/__tests__/gallery/valid-gallery.yaml';

const invalidGalleryPath = 'src/data/__tests__/gallery/invalid-collection-valid-gallery.yaml';

describe('Images Store', () => {
	it('should retrieve all present images', async () => {
		const imagesData = await getImages(testGalleryPath);
		expect(imagesData).toHaveLength(3);
		expect(imagesData[0].src).toEqual(kukuTrees);
		expect(imagesData[1].src).toEqual(popoView);
		expect(imagesData[2].src).toEqual(landscape);
	});

	it('should retrieve only featured images', async () => {
		const images = await getImagesByCollection('featured', testGalleryPath);
		expect(images).toHaveLength(1);
		expect(images[0].title).toEqual('Popo View');
	});

	it('should retrieve images of specific collection', async () => {
		const images = await getImagesByCollection('popo', testGalleryPath);
		expect(images).toHaveLength(1);
		expect(images[0].description).toContain('popo album');
	});

	it('should fail on getting a collection with invalid gallery yaml', async () => {
		await expect(getImagesByCollection('kuku', invalidGalleryPath)).rejects.toThrow(
			ImageStoreError,
		);
	});

	it('should retrieve all collection names', async () => {
		const collections = await getCollections(testGalleryPath);
		expect(collections).toHaveLength(2);
		expect(collections[0].id).toEqual('kuku');
		expect(collections[0].name).toEqual('Kuku');
		expect(collections[1].id).toEqual('popo');
		expect(collections[1].name).toEqual('Popo');
	});

	it('should fail on a missing gallery file', async () => {
		await expect(getImages(invalidGalleryPath)).rejects.toThrow(ImageStoreError);
	});

	it('should fail on invalid gallery file', async () => {
		const galleryPath = 'src/data/__tests__/gallery/invalid-valid-gallery.yaml';
		await expect(getImages(galleryPath)).rejects.toThrow(ImageStoreError);
	});

	it('should fail on invalid collection', async () => {
		const galleryPath = 'src/data/__tests__/gallery/invalid-collection-valid-gallery.yaml';
		await expect(getImages(galleryPath)).rejects.toThrow(ImageStoreError);
	});
});
