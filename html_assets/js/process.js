pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';

const originalPdfContainer = document.getElementById('originalPdfContainer');
const highlightedPdfContainer1 = document.getElementById('highlightedPdfContainer1');
const highlightedPdfContainer2 = document.getElementById('highlightedPdfContainer2');

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
	} catch (error) {
		console.error('Error rendering PDF:', error);
		container.innerHTML = `<p>Error loading PDF: ${error.message}</p>`;
	}
}


let isScrolling = false;
let activeContainer = null;

function initSyncScroll() {
	const originalScrollContainer = document.getElementById('originalPdfViewer');
	const highlightedScrollContainer = document.getElementById('highlightedPdfViewer');

	originalScrollContainer.addEventListener('scroll', function() {
		if (isScrolling && activeContainer !== originalScrollContainer) {
			return;
		}
		activeContainer = originalScrollContainer;
		isScrolling = true;
		highlightedScrollContainer.scrollTop = originalScrollContainer.scrollTop;
		setTimeout(() => {
			isScrolling = false;
			activeContainer = null;
		}, 50);
	});

	highlightedScrollContainer.addEventListener('scroll', function() {
		if (isScrolling && activeContainer !== highlightedScrollContainer) {
			return;
		}
		activeContainer = highlightedScrollContainer;
		isScrolling = true;
		originalScrollContainer.scrollTop = highlightedScrollContainer.scrollTop;
		setTimeout(() => {
			isScrolling = false;
			activeContainer = null;
		}, 50);
	});
}

window.addEventListener('load', function() {initSyncScroll();});

function switchDocument(name) {
	if (name == "progrowth") {
		document.getElementById('highlightedPdfContainer1').style.display = "block";
		document.getElementById('highlightedPdfContainer2').style.display = "none";
		document.getElementById('highlightedPdfViewer').style.border = "10px solid #0094be";
	}
	else {
		document.getElementById('highlightedPdfContainer1').style.display = "none";
		document.getElementById('highlightedPdfContainer2').style.display = "block";
		document.getElementById('highlightedPdfViewer').style.border = "10px solid #0074ab";
	}
}