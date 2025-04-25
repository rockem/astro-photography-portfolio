import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';
import type {
	ImageModule,
	Collection,
	GalleryData,
	GalleryImage,
	Image,
} from './gallerySchema.ts';

/**
 * Error class for image-related errors
 */
export class ImageStoreError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ImageStoreError';
	}
}

/**
 * Import all images from /src directory
 */
const imageModules = import.meta.glob('/src/**/*.{jpg,jpeg,png,gif}', {
	eager: true,
});

const defaultGalleryPath = 'src/gallery/gallery.yaml';

export const featuredCollectionId = 'featured';
const builtInCollections = [featuredCollectionId];

/**
 * Loads and processes images from the collections
 * @param {string} [galleryPath=defaultGalleryPath] - @param galleryPath - Path to the gallery yaml file
 * @returns {Promise<Image[]>} Array of processed images
 * @throws {ImageStoreError} If collections.yaml cannot be read or an image is not found
 */
export const getImages = async (
	galleryPath: string = defaultGalleryPath,
): Promise<Image[]> => {
	try {
		const images = await (await loadGalleryData(galleryPath)).images;
		return processImages(images, galleryPath);
	} catch (error) {
		throw new ImageStoreError(
			`Failed to load images from ${galleryPath}: ${getErrorMsgFrom(error)}`,
		);
	}
};

function getErrorMsgFrom(error: unknown) {
	return error instanceof Error ? error.message : 'Unknown error';
}

/**
 * Loads collections data from YAML file
 * @param {string} yamlPath - Path to the collections.yaml file
 * @returns {Promise<GalleryData>} Parsed collections data
 * @throws {ImageStoreError} If YAML file cannot be read or parsed
 */
const loadGalleryData = async (galleryPath: string): Promise<GalleryData> => {
	try {
		const yamlPath = path.resolve(process.cwd(), galleryPath);
		const content = await fs.readFile(yamlPath, 'utf8');
		const gallery = yaml.load(content) as GalleryData;
		validateGalleryData(gallery);
		return gallery;
	} catch (error) {
		throw new ImageStoreError(
			`Failed to load gallery data from ${galleryPath}: ${getErrorMsgFrom(error)}`,
		);
	}
};

function validateGalleryData(gallery: GalleryData) {
	const collectionIds = gallery.collections
		.map((col) => col.id)
		.concat(builtInCollections);
	for (const image of gallery.images) {
		const invalidCollections = image.collections.filter(
			(col) => !collectionIds.includes(col),
		);
		if (invalidCollections.length > 0) {
			throw new ImageStoreError(
				`Invalid collection(s) [${invalidCollections.join(', ')}] referenced in image: ${image.path}`,
			);
		}
	}
}

/**
 * Processes collections images and returns array of Image objects
 * @param {GalleryImage[]} images - Array of collections images to process
 * @param {string} galleryPath - Path to the collections directory
 * @returns {Image[]} Array of processed images with metadata
 * @throws {ImageStoreError} If an image module cannot be found
 */
const processImages = (
	images: GalleryImage[],
	galleryPath: string,
): Image[] => {
	return images.reduce<Image[]>((acc, imageEntry) => {
		const imagePath = path.join(
			'/',
			path.parse(galleryPath).dir,
			imageEntry.path,
		);
		try {
			acc.push(createImageDataFor(imagePath, imageEntry));
		} catch (error) {
			console.warn(`[WARN] ${getErrorMsgFrom(error)}`);
		}
		return acc;
	}, []);
};

/**
 * Creates image data for a given image path and entry
 * @param {string} imagePath - Path to the image file
 * @param {GalleryImage} img - Gallery image entry
 * @returns {Image} Processed image with metadata
 * @throws {ImageStoreError} If image module cannot be found
 */
const createImageDataFor = (imagePath: string, img: GalleryImage) => {
	const imageModule = imageModules[imagePath] as ImageModule | undefined;

	if (!imageModule) {
		throw new ImageStoreError(`Image not found: ${imagePath}`);
	}

	return {
		src: imageModule.default,
		alt: img.alt,
		description: img.description,
		collections: img.collections,
	};
};

/**
 * Retrieves images belonging to a specific collection
 * @param collection - Collection ID to filter images by
 * @param galleryPath - Path to the gallery yaml file
 * @returns {Promise<Image[]>} Array of images in the specified collection
 */
export const getImagesByCollection = async (
	collection: string,
	galleryPath: string = defaultGalleryPath,
): Promise<Image[]> => {
	const images = await getImages(galleryPath);
	return images.filter((image) => image.collections.includes(collection));
};

/**
 * Retrieves all collections from the gallery
 * @param galleryPath - Path to the gallery yaml file
 * @returns {Promise<Collection[]>} Array of collections
 */
export const getCollections = async (
	galleryPath: string = defaultGalleryPath,
): Promise<Collection[]> => {
	return (await loadGalleryData(galleryPath)).collections;
};
