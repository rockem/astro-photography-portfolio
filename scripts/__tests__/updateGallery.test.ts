import { beforeEach, describe, expect, test } from 'vitest';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBNAILS_DIR = path.join(__dirname, 'thumbnails');
const GALLERIES_YAML = path.join(__dirname, '../../public/galleries.yaml');

describe('Image Processing Script', () => {
	beforeEach(async () => {
		await deleteThumbnailsDir();
	});

	async function deleteThumbnailsDir() {
		if (fs.existsSync(THUMBNAILS_DIR)) {
			await fs.promises.rm(THUMBNAILS_DIR, { recursive: true });
		}
	}

	test('should create thumbnails directory when running processImages', () => {
		runUpdateGallery();

		expect(fs.existsSync(THUMBNAILS_DIR)).toBeTruthy();
	});

	function runUpdateGallery() {
		execSync(`npm run update-gallery ${__dirname}`, {
			stdio: 'pipe',
		});
	}

	test('should create thumbnail for each photo', async () => {
		runUpdateGallery();

		expect(
			fs.existsSync(
				path.join(THUMBNAILS_DIR, 'kuku', 'landscape-test-thumbnail.jpg'),
			),
		).toBeTruthy();
		expect(
			fs.existsSync(
				path.join(THUMBNAILS_DIR, 'popo', 'street-test-thumbnail.jpg'),
			),
		).toBeTruthy();
	});

	test('should update galleries.yaml with image paths', async () => {
		// Run the update gallery script
		runUpdateGallery();

		// Read the galleries.yaml file
		const galleriesContent = fs.readFileSync(GALLERIES_YAML, 'utf8');
		const galleries = yaml.load(galleriesContent) as { images: string[] };

		// Verify that the image paths are added to the galleries.yaml
		expect(galleries.images).toContain('kuku/landscape-test.jpg');
		expect(galleries.images).toContain('popo/street-test.jpg');
	});
});
