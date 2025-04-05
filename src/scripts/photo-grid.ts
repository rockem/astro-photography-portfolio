import justifiedLayout from 'justified-layout';
import GLightbox from 'glightbox';

export async function setupGallery() {
	if (typeof document === 'undefined') return;

	const container = document.getElementById('photo-grid');
	if (!container) {
		console.error('Photo grid container not found.');
		return;
	}

	const imageLinks = Array.from(
		container.querySelectorAll('.photo-item'),
	) as HTMLElement[];

	if (imageLinks.length === 0) {
		console.warn('No images found inside the photo grid.');
		return;
	}

	// Wait for all images to load
	const imageElements = await waitForImagesToLoad(container);

	// Get actual image dimensions after loading
	const layout = createLayoutFor(imageElements, container);
	console.log('Generated layout:', layout);

	applyImagesStyleBasedOnLayout(imageLinks, layout);
	applyContainerStyleBasedOnLayout(container, layout);

	// Initialize GLightbox
	GLightbox({
		selector: '.glightbox',
		openEffect: 'zoom',
		closeEffect: 'fade',
		width: 'auto',
		height: 'auto',
	});
}

function createLayoutFor(
	imageElements: HTMLImageElement[],
	container: HTMLElement,
): any {
	const imageSizes = imageElements.map((img) => ({
		width: img.naturalWidth || img.width || 300,
		height: img.naturalHeight || img.height || 200,
	}));

	const layout = justifiedLayout(imageSizes, {
		containerWidth: container.clientWidth || window.innerWidth,
		targetRowHeight: 300,
		boxSpacing: 10,
		containerPadding: 0,
	});
	return layout;
}

async function waitForImagesToLoad(container: HTMLElement) {
	const imageElements = Array.from(
		container.querySelectorAll('img'),
	) as HTMLImageElement[];

	await Promise.all(
		imageElements.map(
			(img) =>
				new Promise((resolve) => {
					if (img.complete) {
						resolve(null);
					} else {
						img.onload = () => resolve(null);
						img.onerror = () => resolve(null);
					}
				}),
		),
	);
	return imageElements;
}

function applyImagesStyleBasedOnLayout(imageLinks: HTMLElement[], layout: any) {
	imageLinks.forEach((el, i) => {
		if (!layout.boxes[i]) return;
		const { left, top, width, height } = layout.boxes[i];

		el.style.position = 'absolute';
		el.style.left = `${left}px`;
		el.style.top = `${top}px`;
		el.style.width = `${width}px`;
		el.style.height = `${height}px`;
		el.style.display = 'block';
	});
}

function applyContainerStyleBasedOnLayout(container: HTMLElement, layout: any) {
	// Ensure the parent container has relative positioning
	container.style.position = 'relative';
	// Set container height
	container.style.height = `${layout.containerHeight}px`;
}
// Run setupGallery once the page is loaded
if (typeof window !== 'undefined') {
	const debouncedSetup = debounce(setupGallery, 250);

	document.addEventListener('DOMContentLoaded', setupGallery);
	window.addEventListener('resize', debouncedSetup);
}

// Debounce helper
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
	let timeout: ReturnType<typeof setTimeout>;
	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
