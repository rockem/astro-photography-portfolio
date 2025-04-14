import { describe, expect, test } from 'vitest';
import kukuTrees from './gallery/kuku/kuku-trees.jpg';
import popoView from './gallery/popo/popo-view.jpg';
import { getCollections } from '../imageStore.ts';

const { getImages } = await import('../imageStore.ts');

describe('Images Store', () => {
	test('should retrieve all present images', async () => {
		const imagesData = await getTestImages();
		expect(imagesData).toHaveLength(2);
		expect(imagesData[0].src).toEqual(kukuTrees);
		expect(imagesData[1].src).toEqual(popoView);
	});

	async function getTestImages(filter: any = {}) {
		return await getImages(filter, 'src/data/__tests__/gallery');
	}

	test('should retrieve only featured images', async () => {
		const images = await getTestImages({ featured: true });
		expect(images).toHaveLength(1);
		expect(images[0].alt).toEqual('Popo View');
	});

	test('should retrieve images of specific collection', async () => {
		const images = await getTestImages({ collection: 'popo' });
		expect(images).toHaveLength(1);
		expect(images[0].description).toContain('popo album');
	});

	test('should retrieve all collection names', async () => {
		const collections = await getCollections('src/data/__tests__/gallery');
		expect(collections).toHaveLength(2);
		expect(collections[0]).toEqual('kuku');
		expect(collections[1]).toEqual('popo');
	});
});
