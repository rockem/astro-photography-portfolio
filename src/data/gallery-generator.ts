import { program } from 'commander';
import * as fs from 'node:fs';
import yaml from 'js-yaml';
import path from 'path';
import fg from 'fast-glob';

const defaultGalleryFileName = 'gallery.yaml';

async function createGalleryFile(galleryDir: string): Promise<void> {
	try {
		const galleryObj = await createGalleryObjFrom(galleryDir);
		await writeGalleryYaml(galleryDir, galleryObj);
	} catch (error) {
		console.error('Failed to create gallery file:', error);
		process.exit(1);
	}
}

async function createGalleryObjFrom(galleryDir: string) {
	const imageFiles = await fg(`${galleryDir}/**/*.{jpg,jpeg,png}`, {
		dot: false,
	});
	const galleryObj = {
		collections: createCollectionsFrom(imageFiles, galleryDir),
	};
	return galleryObj;
}

function createCollectionsFrom(imageFiles: string[], galleryDir: string) {
	return imageFiles.map((file) => {
		const relativePath = path.relative(galleryDir, file); // e.g. "collection1/image.jpg"
		return {
			id: path.dirname(relativePath),
		}; // e.g. "collection1"
	});
}

async function writeGalleryYaml(
	galleryDir: string,
	galleryObj: { collections: { id: string }[] },
) {
	const filePath = path.join(galleryDir, defaultGalleryFileName);
	await fs.promises.writeFile(filePath, yaml.dump(galleryObj), 'utf8');
	console.log('Gallery file created successfully at:', filePath);
}

program.argument('<path to images directory>');
program.parse();

const directoryPath = program.args[0];
if (!directoryPath || !fs.existsSync(directoryPath)) {
	console.error('Invalid directory path provided.');
	process.exit(1);
}

createGalleryFile(directoryPath);
