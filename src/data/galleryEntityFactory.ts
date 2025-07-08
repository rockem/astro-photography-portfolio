import path from 'path';
import type { GalleryImage, ImageExif } from './galleryData.ts';
import exifr from 'exifr';

export const createGalleryImage = async (
	galleryDir: string,
	file: string,
): Promise<GalleryImage> => {
	const relativePath = path.relative(galleryDir, file);
	const exifData = await exifr.parse(file);
	const image = {
		path: relativePath,
		meta: {
			title: toReadableCaption(path.basename(relativePath, path.extname(relativePath))),
			description: '',
			collections: collectionIdForImage(relativePath),
		},
		exif: {},
	};
	if (exifData) {
		image.exif = getExifFrom(exifData);
	}
	return image;
};

function getExifFrom(exifData: Partial<Record<string, unknown>>): ImageExif {
	console.log(exifData.DateTimeOriginal);
	return {
		captureDate:
			typeof exifData.DateTimeOriginal === 'object'
				? new Date(`${exifData.DateTimeOriginal} UTC`)
				: undefined,
		fNumber: typeof exifData.FNumber === 'number' ? exifData.FNumber : undefined,
		focalLength: typeof exifData.FocalLength === 'number' ? exifData.FocalLength : undefined,
		iso: typeof exifData.ISO === 'number' ? exifData.ISO : undefined,
		model: typeof exifData.Model === 'string' ? exifData.Model : undefined,
		shutterSpeed: typeof exifData.ExposureTime === 'number' ? 1 / exifData.ExposureTime : undefined,
		lensModel: typeof exifData.LensModel === 'string' ? exifData.LensModel : undefined,
	};
}

function toReadableCaption(input: string): string {
	return input
		.replace(/[^a-zA-Z0-9]+/g, ' ') // Replace non-alphanumerics with space
		.split(' ') // Split by space
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize
		.join(' ');
}

function collectionIdForImage(relativePath: string) {
	return path.dirname(relativePath) === '.' ? [] : [path.dirname(relativePath)];
}

export const createGalleryCollection = (dir: string) => {
	return {
		id: dir,
		name: toReadableCaption(dir),
	};
};
