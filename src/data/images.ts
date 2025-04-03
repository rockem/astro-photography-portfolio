import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Image {
	id: number;
	src: string;
	thumbnail: string;
	alt: string;
	width: number;
	height: number;
	description: string;
}

export function getImages(): Image[] {
	const yamlPath = path.join(__dirname, '../../../public/galleries.yaml');
	const yamlContent = fs.readFileSync(yamlPath, 'utf8');
	const data = yaml.load(yamlContent) as { images: Image[] };
	return data.images;
}
