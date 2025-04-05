import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

export interface GalleryImage {
	path: string;
	alt: string;
	description: string;
	category: string;
}

export interface GalleryData {
	images: GalleryImage[];
}

export interface Image {
	src: ImageMetadata;
	alt: string;
	description: string;
	category: string;
}

// Dynamic imports for all images
const imageModules = import.meta.glob('../gallery/**/*.{jpg,jpeg,png,gif}', {
	eager: true,
});

// Load gallery data from YAML
const galleryYamlPath = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	'../gallery/gallery.yaml',
);

const galleryData = yaml.load(
	await fs.readFile(galleryYamlPath, 'utf8'),
) as GalleryData;

// Convert gallery data to Image objects with imported image metadata
export const images: Image[] = galleryData.images.map((img) => {
	const imagePath = `../gallery/${img.path}`;
	const imageModule = imageModules[imagePath] as { default: ImageMetadata };

	if (!imageModule) {
		throw new Error(`Image not found: ${imagePath}`);
	}

	return {
		src: imageModule.default,
		alt: img.alt,
		description: img.description,
		category: img.category,
	};
});
