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
		images: createImagesFrom(imageFiles, galleryDir),
	};
	return galleryObj;
}

function createCollectionsFrom(imageFiles: string[], galleryDir: string) {
	return imageFiles.map((file) => {
		const relativePath = path.relative(galleryDir, file);
		return {
			id: path.dirname(relativePath),
			name: toPascalCase(path.dirname(relativePath)),
		};
	});
}

function toPascalCase(input: string): string {
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
			title: toPascalCase(
				path.basename(relativePath, path.extname(relativePath)),
			),
			description: '',
			collections: [path.dirname(relativePath)],
		};
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
