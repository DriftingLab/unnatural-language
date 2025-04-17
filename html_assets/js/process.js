pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';

const originalPdfContainer = document.getElementById('originalPdfContainer');
const highlightedPdfContainer = document.getElementById('highlightedPdfContainer');

let highlightPositions = [];

let currentPdfFile = null;

async function renderPDF(url, container) {
	container.innerHTML = '';
	
	try {
		const loadingTask = pdfjsLib.getDocument(url);
		const pdf = await loadingTask.promise;
		
		for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
			const page = await pdf.getPage(pageNum);
			const scale = 1.5;
			const viewport = page.getViewport({ scale });
			
			const canvasWrapper = document.createElement('div');
			canvasWrapper.style.width = '100%';
			container.appendChild(canvasWrapper);
			
			const canvas = document.createElement('canvas');
			canvas.className = 'pdf-canvas';
			
			canvas.width = viewport.width;
			canvas.height = viewport.height;
			canvas.style.width = '100%';
			canvas.style.height = 'auto';
			
			canvasWrapper.appendChild(canvas);
			
			const context = canvas.getContext('2d');
			await page.render({
				canvasContext: context,
				viewport: viewport
			}).promise;
		}
		if (container.id === 'highlightedPdfContainer') {
			initSyncScroll();
		}
	} catch (error) {
		console.error('Error rendering PDF:', error);
		container.innerHTML = `<p>Error loading PDF: ${error.message}</p>`;
	}
}


let isScrolling = false;
let activeContainer = null;

function initSyncScroll() {
	setupScrollSync(document.getElementById('originalPdfContainer'));
	setupScrollSync(document.getElementById('highlightedPdfContainer'));
}

function setupScrollSync(container) {
	
	const scrollContainer = container.closest('.pdf-viewer');
	
	scrollContainer.addEventListener('scroll', function() {
		if (isScrolling && activeContainer !== scrollContainer) {
			return;
		}
		activeContainer = scrollContainer;
		isScrolling = true;
		const otherContainer = scrollContainer.id === 'originalPdfContainer' || 
							  scrollContainer.closest('.pdf-viewer').contains(document.getElementById('originalPdfContainer'))
			? document.getElementById('highlightedPdfContainer').closest('.pdf-viewer')
			: document.getElementById('originalPdfContainer').closest('.pdf-viewer');
		
		otherContainer.scrollTop = scrollContainer.scrollTop;
		
		setTimeout(() => {
			isScrolling = false;
			activeContainer = null;
		}, 50);
	});
}