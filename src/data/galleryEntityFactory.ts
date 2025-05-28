import path from 'path';
import type { GalleryImage } from './galleryData.ts';
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
		image.exif = {
			captureDate: exifData.DateTimeOriginal
				? new Date(`${exifData.DateTimeOriginal} UTC`)
				: undefined,
			fNumber: exifData.FNumber,
			focalLength: exifData.FocalLength,
			iso: exifData.ISO,
			model: exifData.Model,
			shutterSpeed: 1 / exifData.ExposureTime,
			lensModel: exifData.LensModel,
		};
	}
	return image;
};

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
