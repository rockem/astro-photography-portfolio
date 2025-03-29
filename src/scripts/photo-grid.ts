import justifiedLayout from 'justified-layout';
import GLightbox from 'glightbox';

export function setupGallery() {
	if (typeof document === 'undefined') return;

	const container = document.getElementById('photo-grid');
	if (!container) {
		console.error('Photo grid container not found.');
		return;
	}

	const images = Array.from(
		container.querySelectorAll('.photo-item'),
	) as HTMLElement[];
	if (images.length === 0) {
		console.warn('No images found inside the photo grid.');
		return;
	}

	// Define aspect ratio data for layout
	const imageSizes = images.map((img) => {
		const width = img.getBoundingClientRect().width || 300; // Default width
		const height = img.getBoundingClientRect().height || 200; // Default height
		return { width, height };
	});

	const layout = justifiedLayout(imageSizes, {
		containerWidth: container.clientWidth || window.innerWidth,
		targetRowHeight: 200,
		boxSpacing: 10,
	});

	console.log('Generated layout:', layout);

	// Apply styles based on the layout
	images.forEach((el, i) => {
		if (!layout.boxes[i]) return;
		const { left, top, width, height } = layout.boxes[i];

		// Ensure the parent container has relative positioning
		container.style.position = 'relative';

		el.style.position = 'absolute';
		el.style.left = `${left}px`;
		el.style.top = `${top}px`;
		el.style.width = `${width}px`;
		el.style.height = `${height}px`;
		el.style.display = 'block'; // Ensure it's visible
	});

	// Adjust container height based on the layout
	container.style.height = `${layout.containerHeight}px`;

	console.log('Final container height set to:', layout.containerHeight);

	const lightbox = GLightbox({
		loop: true,
		draggable: false,
	});

	console.log('GLightbox initialized:', lightbox);
}

// Run setupGallery once the page is loaded
if (typeof window !== 'undefined') {
	document.addEventListener('DOMContentLoaded', setupGallery);
	window.addEventListener('resize', setupGallery);
}
