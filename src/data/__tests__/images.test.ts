import { beforeEach, describe, expect, test } from 'vitest';
import kukuTrees from './gallery/kuku/kuku-trees.jpg';
import popoView from './gallery/popo/popo-view.jpg';
const { allImages, featuredImages } = await import('../imageStore.ts');

describe('Images Store', () => {
	beforeEach(() => {});

	test('should retrieve all present images', async () => {
		const imagesData = await allImages('src/data/__tests__/gallery');
		expect(imagesData).toHaveLength(2);
		expect(imagesData[0].src).toEqual(kukuTrees);
		expect(imagesData[1].src).toEqual(popoView);
	});

	test('should retrieve only featured images', async () => {
		const images = await featuredImages('src/data/__tests__/gallery');
		expect(images).toHaveLength(1);
		expect(images[0].alt).toEqual('Popo View');
	});
});
