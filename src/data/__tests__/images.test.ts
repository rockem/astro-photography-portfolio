import { beforeEach, describe, expect, test } from 'vitest';
import kukuTrees from './gallery/kuku/kuku-trees.jpg';
import popoView from './gallery/popo/popo-view.jpg';

describe('Images Store', () => {
	beforeEach(() => {});

	test('should retrieve all present images', async () => {
		const { allImages } = await import('../imageStore.ts');

		const imagesData = await allImages('src/data/__tests__/gallery');
		expect(imagesData).toHaveLength(2);
		expect(imagesData[0].src).toEqual(kukuTrees);
		expect(imagesData[1].src).toEqual(popoView);
	});

	/*test('throws error for missing image', async () => {
		// Override import.meta.glob with missing popo-view image
		// @ts-ignore
		globalThis.import.meta = {
			glob: () => ({
				'../gallery/kuku/kuku-trees.jpg': {
					default: kukuTreesMetadata,
				},
			}),
		};

		// Import should throw error due to missing popo-view.jpg
		await expect(import('../images')).rejects.toThrow('Image not found');
	});*/
});
