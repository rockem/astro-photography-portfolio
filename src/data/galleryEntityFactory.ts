import path from 'path';
import type { GalleryImage } from './galleryData.ts';
import exifr from 'exifr';

export const createGalleryImage = async (
	galleryDir: string,
	file: string,
): Promise<GalleryImage> => {
	const relativePath = path.relative(galleryDir, file);
	const exifData = await exifr.parse(file);
	return {
		path: relativePath,
		meta: {
			title: toReadableCaption(path.basename(relativePath, path.extname(relativePath))),
			description: '',
			collections: collectionIdForImage(relativePath),
		},
		exif: {
			captureDate: new Date(exifData.DateTimeOriginal),
		},
	};
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
