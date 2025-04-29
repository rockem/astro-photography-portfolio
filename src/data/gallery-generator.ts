import { program } from 'commander';
import * as fs from 'node:fs';
import yaml from 'js-yaml';
import path from 'path';

export const defaultGalleryFileName = 'gallery.yaml';

async function createGalleryFile(directoryPath: string): Promise<void> {
	try {
		const galleryObj = {
			collections: [{ id: 'kuku' }, { id: 'popo' }],
		};
		const filePath = path.join(directoryPath, defaultGalleryFileName);
		await fs.promises.writeFile(filePath, yaml.dump(galleryObj), 'utf8');
		console.log('Gallery file created successfully at:', filePath);
	} catch (error) {
		console.error('Failed to create gallery file:', error);
		process.exit(1);
	}
}

program.argument('<path to gallery images>');
program.parse();

const directoryPath = program.args[0];
if (!directoryPath || !fs.existsSync(directoryPath)) {
	console.error('Invalid directory path provided.');
	process.exit(1);
}

createGalleryFile(directoryPath);
