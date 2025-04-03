import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { glob } from 'glob';
import { Command } from 'commander';
import yaml from 'js-yaml';

interface Options {
	quality: number;
	width: number;
	output: string;
	source: string;
}

const program = new Command();

program
	.name('create-thumbnails')
	.description('Create thumbnails for images in a directory')
	.argument('<directory>', 'Target directory containing source directory')
	.option('-q, --quality <number>', 'JPEG quality (1-100)', '90')
	.option('-w, --width <number>', 'Thumbnail width in pixels', '800')
	.option('-o, --output <directory>', 'Output directory name', 'thumbnails')
	.option(
		'-s, --source <directory>',
		'Source images directory name',
		'galleries',
	)
	.version('1.0.0');

program.parse();

const options = program.opts<Options>();
const targetPath = program.args[0];

const main = async () => {
	if (!targetPath) {
		throw new Error('Please provide a target directory path');
	}

	const images = await findImages(path.join(targetPath, options.source));
	if (images.length === 0) {
		console.log(`No images found in ${path.join(targetPath, options.source)}`);
		return;
	}

	await createThumbnailsFor(images);
	await updateGalleriesYaml(images);
	console.log(
		`✨ Created ${images.length} thumbnails and updated galleries.yaml`,
	);
};

const findImages = async (dir: string): Promise<string[]> => {
	// Find all jpg and png files, excluding thumbnails
	const pattern = path.join(dir, '**/*.{jpg,jpeg,png}');
	return await glob(pattern, {
		nocase: true,
		ignore: [`**/${options.output}/**`],
	});
};

const createThumbnailsFor = async (images: string[]) => {
	await Promise.all(
		images.map(async (imagePath) => {
			const relativePath = path.relative(
				path.join(targetPath, options.source),
				imagePath,
			);
			const parsedPath = path.parse(relativePath);
			const thumbnailPath = path.join(
				targetPath,
				options.output,
				parsedPath.dir,
				`${parsedPath.name}-thumbnail${parsedPath.ext}`,
			);
			await createThumbnail(imagePath, thumbnailPath);
		}),
	);
};

const createThumbnail = async (imagePath: string, thumbnailPath: string) => {
	const thumbnailDir = path.dirname(thumbnailPath);
	fs.mkdirSync(thumbnailDir, { recursive: true });

	await sharp(imagePath)
		.resize(Number(options.width), null, { withoutEnlargement: true })
		.jpeg({ quality: Number(options.quality) })
		.toFile(thumbnailPath);
};

const updateGalleriesYaml = async (images: string[]) => {
	const galleriesYamlPath = path.join(
		process.cwd(),
		'public',
		'galleries.yaml',
	);
	const relativePaths = images.map((imagePath) => {
		return path.relative(path.join(targetPath, options.source), imagePath);
	});

	// Read existing yaml or create new one
	let content: { images: string[] };
	try {
		const existingContent = fs.readFileSync(galleriesYamlPath, 'utf8');
		content = yaml.load(existingContent) as { images: string[] };
	} catch {
		content = { images: [] };
	}

	// Update with new paths
	content.images = relativePaths;

	// Write back to file
	fs.writeFileSync(galleriesYamlPath, yaml.dump(content));
};

main().catch((error) => {
	console.error('❌ Error:', error.message);
	process.exit(1);
});
