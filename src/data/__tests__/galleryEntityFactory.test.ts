import { describe, expect, it } from 'vitest';
import { createGalleryImage } from '../galleryEntityFactory.ts';

const testGalleryPath = 'src/data/__tests__/gallery';

describe('test create gallery images', () => {
	it('should retrieve capture date', async () => {
		const image = await createGalleryImage(
			testGalleryPath,
			'src/data/__tests__/gallery/kuku/kuku-trees.jpg',
		);
		expect(image.exif.captureDate).toEqual(new Date('2025-02-21T07:17:14.000Z'));
	});
});
