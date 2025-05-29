import { describe, expect, it } from 'vitest';
import { createGalleryImage } from '../galleryEntityFactory.ts';
import path from 'path';

const testGalleryPath = path.join('src', 'data', '__tests__', 'gallery');

describe('test create gallery images', () => {
	it('should retrieve image with exif data', async () => {
		const image = await createGalleryImage(
			testGalleryPath,
			path.join(testGalleryPath, 'kuku', 'kuku-trees.jpg'),
		);
		expect(image.exif?.captureDate).toEqual(new Date('2025-02-21T09:17:14.000Z'));
		expect(image.exif?.fNumber).toEqual(8);
		expect(image.exif?.focalLength).toEqual(28);
		expect(image.exif?.iso).toEqual(100);
		expect(image.exif?.shutterSpeed).toEqual(640);
		expect(image.exif?.model).toEqual('LEICA Q3');
		expect(image.exif?.lensModel).toEqual('SUMMILUX 1:1.7/28 ASPH.');
	});

	it('should retrieve image without exif data', async () => {
		const image = await createGalleryImage(
			testGalleryPath,
			path.join(__dirname, 'without-exif.jpg'),
		);
		expect(image.exif).toEqual({});
	});
});
