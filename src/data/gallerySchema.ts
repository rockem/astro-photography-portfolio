import type { ImageMetadata } from 'astro';

/**
 * Structure of the collections YAML file
 * @property {Collection[]} collections - Array of collections
 */
export interface GalleryData {
	collections: Collection[];
	images: GalleryImage[];
}

/**
 * Represents a collection of images
 * @property {string} name - Name of the collection
 * @property {GalleryImage[]} getImages - Array of images in the collection
 */
export interface Collection {
	id: string;
	name: string;
}

/**
 * Represents an image entry in the collections YAML file
 * @property {string} path - Relative path to the image file
 * @property {string} alt - Alt text for accessibility and title
 * @property {string} description - Detailed description of the image
 * @property {string[]} collections - Array of collection IDs the image belongs to
 */
export interface GalleryImage {
	path: string;
	meta: Meta;
}

/**
 * Represents the metadata of an image
 * @property {string} path - Relative path to the image file
 * @property {string} title - Title of the image
 * @property {string} description - Detailed description of the image
 * @property {string[]} collections - Array of collection IDs the image belongs to
 */
export interface Meta {
	title: string;
	description: string;
	collections: string[];
}

/**
 * Represents a processed image with metadata
 * @property {ImageMetadata} src - Image source metadata from Astro
 * @property {string} alt - Alt text for accessibility
 * @property {string} description - Detailed description of the image
 * @property {string[]} collections - Array of collection IDs the image belongs to
 */
export interface Image {
	src: ImageMetadata;
	title: string;
	description: string;
	collections: string[];
}

/**
 * Type for the image module import result
 * @property {ImageMetadata} default - Default export containing image metadata
 */
export type ImageModule = { default: ImageMetadata };
