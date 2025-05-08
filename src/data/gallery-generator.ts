import { program } from 'commander';
import * as fs from 'node:fs';
import yaml from 'js-yaml';
import path from 'path';
import fg from 'fast-glob';
import { type GalleryData, loadGallery, NullGalleryData } from './galleryData.ts';

const defaultGalleryFileName = 'gallery.yaml';

async function generateGalleryFile(galleryDir: string): Promise<void> {
	try {
		let galleryObj = await loadExistingGallery(galleryDir);
		galleryObj = mergeGalleriesObj(galleryObj, await createGalleryObjFrom(galleryDir));
		await writeGalleryYaml(galleryDir, galleryObj);
	} catch (error) {
		console.error('Failed to create gallery file:', error);
		process.exit(1);
	}
}

async function loadExistingGallery(galleryDir: string) {
	const existingGalleryFile = path.join(galleryDir, defaultGalleryFileName);
	if (fs.existsSync(existingGalleryFile)) {
		return await loadGallery(existingGalleryFile);
	}
	return NullGalleryData;
}

function mergeGalleriesObj(
	targetGalleryObj: GalleryData,
	sourceGalleryObj: GalleryData,
): GalleryData {
	return {
		collections: getUpdatedCollectionList(targetGalleryObj, sourceGalleryObj),
		images: getUpdatedImageList(targetGalleryObj, sourceGalleryObj),
	};
}

function getUpdatedImageList(targetGalleryObj: GalleryData, sourceGalleryObj: GalleryData) {
	const imagesMap = new Map(targetGalleryObj.images.map((image) => [image.path, image]));
	sourceGalleryObj.images.map((image) => {
		if (!imagesMap.get(image.path)) {
			imagesMap.set(image.path, image);
		}
	});
	return Array.from(imagesMap.values());
}

function getUpdatedCollectionList(targetGalleryObj: GalleryData, sourceGalleryObj: GalleryData) {
	const collectionsMap = new Map(
		targetGalleryObj.collections.map((collection) => [collection.id, collection]),
	);
	sourceGalleryObj.collections.map((collection) => {
		if (!collectionsMap.get(collection.id)) {
			collectionsMap.set(collection.id, collection);
		}
	});
	return Array.from(collectionsMap.values());
}

async function createGalleryObjFrom(galleryDir: string): Promise<GalleryData> {
	const imageFiles = await fg(`${galleryDir}/**/*.{jpg,jpeg,png}`, {
		dot: false,
	});
	const galleryObj = {
		collections: createCollectionsFrom(imageFiles, galleryDir),
		images: createImagesFrom(imageFiles, galleryDir),
	};
	return galleryObj;
}

function createCollectionsFrom(imageFiles: string[], galleryDir: string) {
	const uniqueDirNames = new Set(
		imageFiles.map((file) => path.dirname(path.relative(galleryDir, file))),
	);

	return [...uniqueDirNames]
		.map((dir) => {
			return {
				id: dir,
				name: toReadableCaption(dir),
			};
		})
		.filter((col) => col.id !== '.');
}

function toReadableCaption(input: string): string {
	return input
		.replace(/[^a-zA-Z0-9]+/g, ' ') // Replace non-alphanumerics with space
		.split(' ') // Split by space
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize
		.join(' ');
}

function createImagesFrom(imageFiles: string[], galleryDir: string) {
	return imageFiles.map((file) => {
		const relativePath = path.relative(galleryDir, file);
		return {
			path: relativePath,
			meta: {
				title: toReadableCaption(path.basename(relativePath, path.extname(relativePath))),
				description: '',
				collections: collectionIdForImage(relativePath),
			},
		};
	});
}

function collectionIdForImage(relativePath: string) {
	return path.dirname(relativePath) === '.' ? [] : [path.dirname(relativePath)];
}

async function writeGalleryYaml(galleryDir: string, galleryObj: GalleryData) {
	const filePath = path.join(galleryDir, defaultGalleryFileName);
	await fs.promises.writeFile(filePath, yaml.dump(galleryObj), 'utf8');
	console.log('Gallery file created/updated successfully at:', filePath);
}

program.argument('<path to images directory>');
program.parse();

const directoryPath = program.args[0];
if (!directoryPath || !fs.existsSync(directoryPath)) {
	console.error('Invalid directory path provided.');
	process.exit(1);
}

(async () => {
	await generateGalleryFile(directoryPath);
})().catch((error) => {
	console.error('Unhandled error:', error);
	process.exit(1);
});
