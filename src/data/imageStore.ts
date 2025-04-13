import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import type { ImageMetadata } from 'astro';

/**
 * Represents an image entry in the gallery YAML file
 */
export interface GalleryImage {
	path: string;
	alt: string;
	description: string;
	featured: boolean;
}

export interface Collection {
	name: string;
	images: GalleryImage[];
}

/**
 * Structure of the gallery YAML file
 */
export interface GalleryData {
	collections: Collection[];
}

/**
 * Represents a processed image with metadata
 */
export interface Image {
	src: ImageMetadata;
	alt: string;
	description: string;
	featured: boolean;
}

/**
 * Type for the image module import result
 */
type ImageModule = { default: ImageMetadata };

/**
 * Error class for image-related errors
 */
export class ImageError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ImageError';
	}
}

/**
 * Import all images from /src directory
 */
const imageModules = import.meta.glob('/src/**/*.{jpg,jpeg,png,gif}', {
	eager: true,
});

const defaultGalleryPath = 'src/gallery';

const galleryYaml = 'gallery.yaml';
/**
 * Loads and processes images from the gallery
 * @param galleryPath - Path to the gallery directory
 * @returns Promise resolving to an array of processed images
 * @throws {ImageError} If gallery.yaml cannot be read or an image is not found
 */
export const allImages = async (
	galleryPath: string = defaultGalleryPath,
): Promise<Image[]> => {
	try {
		// const resolvedPath = resolveGalleryPath(galleryPath);
		const yamlPath = path.resolve(process.cwd(), galleryPath, galleryYaml);
		const galleryData = await loadGalleryData(yamlPath);
		const images = galleryData.collections.reduce<GalleryImage[]>(
			(acc, collectionEntry) => {
				acc.push(...collectionEntry.images);
				return acc;
			},
			[],
		);
		return processImages(images, galleryPath);
	} catch (error) {
		throw new ImageError(
			`Failed to load images from ${galleryPath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
};

/**
 * Loads gallery data from YAML file
 * @param yamlPath - Path to the gallery.yaml file
 * @returns Promise resolving to gallery data
 * @throws {ImageError} If YAML file cannot be read or parsed
 */
const loadGalleryData = async (yamlPath: string): Promise<GalleryData> => {
	try {
		const content = await fs.readFile(yamlPath, 'utf8');
		return yaml.load(content) as GalleryData;
	} catch (error) {
		throw new ImageError(
			`Failed to load gallery data from ${yamlPath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
};

/**
 * Processes gallery images and returns array of Image objects
 * @param galleryData - The gallery data from YAML
 * @param galleryPath - Path to the gallery directory
 * @returns Array of processed images
 * @throws {ImageError} If an image module cannot be found
 */
const processImages = (
	images: GalleryImage[],
	galleryPath: string,
): Image[] => {
	return images.reduce<Image[]>((acc, imageEntry) => {
		const imagePath = path.join('/', galleryPath, imageEntry.path);
		try {
			acc.push(createImageDataFor(imagePath, imageEntry));
		} catch (error: any) {
			console.warn(`[WARN] ${error.message}`);
		}
		return acc;
	}, []);
};

const createImageDataFor = (imagePath: string, img: GalleryImage) => {
	const imageModule = imageModules[imagePath] as ImageModule | undefined;

	if (!imageModule) {
		throw new ImageError(`Image not found: ${imagePath}`);
	}

	return {
		src: imageModule.default,
		alt: img.alt,
		description: img.description,
		featured: img.featured,
	};
};

export const featuredImages = async (
	galleryPath: string = defaultGalleryPath,
): Promise<Image[]> => {
	return (await allImages(galleryPath)).filter((image) => image.featured);
};
