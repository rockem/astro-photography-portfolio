import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import type { ImageMetadata } from 'astro';

/**
 * Structure of the gallery YAML file
 * @property {Collection[]} collections - Array of collections
 */
export interface GalleryData {
	collections: Collection[];
}

/**
 * Represents a collection of images
 * @property {string} name - Name of the collection
 * @property {GalleryImage[]} getImages - Array of images in the collection
 */
export interface Collection {
	name: string;
	images: GalleryImage[];
}

/**
 * Represents an image entry in the gallery YAML file
 * @property {string} path - Relative path to the image file
 * @property {string} alt - Alt text for accessibility and title
 * @property {string} description - Detailed description of the image
 * @property {boolean} featured - Whether the image should in featured gallery
 * @property {string} collection - Name of the collection this image belongs to
 */
export interface GalleryImage {
	path: string;
	alt: string;
	description: string;
	featured: boolean;
	collection: string;
}

/**
 * Represents a processed image with metadata
 * @property {ImageMetadata} src - Image source metadata from Astro
 * @property {string} alt - Alt text for accessibility
 * @property {string} description - Detailed description of the image
 * @property {boolean} featured - Whether the image should be featured
 */
export interface Image {
	src: ImageMetadata;
	alt: string;
	description: string;
	featured: boolean;
}

/**
 * Type for the image module import result
 * @property {ImageMetadata} default - Default export containing image metadata
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
 * @param {string} [galleryPath=defaultGalleryPath] - Path to the gallery directory
 * @param {any} [filterBy={}] - Filter criteria for images
 * @returns {Promise<Image[]>} Array of processed images
 * @throws {ImageError} If gallery.yaml cannot be read or an image is not found
 */
export const getImages = async (
	filterBy: any = {},
	galleryPath: string = defaultGalleryPath,
): Promise<Image[]> => {
	try {
		const images = await getAllImagesFrom(galleryPath);
		return processImages(filterImages(images, filterBy), galleryPath);
	} catch (error) {
		throw new ImageError(
			`Failed to load images from ${galleryPath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
};

/**
 * Retrieves all images from the specified gallery path
 * @param {string} galleryPath - Path to the gallery directory
 * @returns {Promise<GalleryImage[]>} Array of gallery images with collection information
 */
async function getAllImagesFrom(galleryPath: string) {
	const yamlPath = path.resolve(process.cwd(), galleryPath, galleryYaml);
	const galleryData = await loadGalleryData(yamlPath);
	const images = galleryData.collections.reduce<GalleryImage[]>(
		(acc, collectionEntry) => {
			acc.push(
				...collectionEntry.images.map((imageEntry) => {
					imageEntry.collection = collectionEntry.name;
					return imageEntry;
				}),
			);
			return acc;
		},
		[],
	);
	return images;
}

/**
 * Loads gallery data from YAML file
 * @param {string} yamlPath - Path to the gallery.yaml file
 * @returns {Promise<GalleryData>} Parsed gallery data
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
 * @param {GalleryImage[]} images - Array of gallery images to process
 * @param {string} galleryPath - Path to the gallery directory
 * @returns {Image[]} Array of processed images with metadata
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

/**
 * Creates image data for a given image path and entry
 * @param {string} imagePath - Path to the image file
 * @param {GalleryImage} img - Gallery image entry
 * @returns {Image} Processed image with metadata
 * @throws {ImageError} If image module cannot be found
 */
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

/**
 * Filters images based on the provided criteria
 * @param {GalleryImage[]} images - Array of images to filter
 * @param {any} filterBy - Filter criteria object
 * @returns {GalleryImage[]} Filtered array of images
 */
function filterImages(images: GalleryImage[], filterBy: any) {
	return images.filter((image) => {
		const key = Object.keys(filterBy)[0] as keyof GalleryImage;
		return key ? image[key] === filterBy[key] : true;
	});
}
