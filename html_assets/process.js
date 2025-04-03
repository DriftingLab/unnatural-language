pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js';

const pdfFileInput = document.getElementById('pdfFileInput');
const processBtn = document.getElementById('processBtn');
const statusDiv = document.getElementById('status');
const loadingDiv = document.getElementById('loading');
const originalPdfContainer = document.getElementById('originalPdfContainer');
const highlightedPdfContainer = document.getElementById('highlightedPdfContainer');

const API_URL = 'http://127.0.0.1:5000';

let highlightPositions = [];

let currentPdfFile = null;

function updateProcessButton() {
	processBtn.disabled = !currentPdfFile;
}

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

async function processPDF() {
	if (!currentPdfFile) return;
	statusDiv.style.display = 'none';
	loadingDiv.style.display = 'block';
	
	try {
		const formData = new FormData();
		formData.append('file', currentPdfFile);

		const response = await fetch(`${API_URL}/process_pdf`, {
			method: 'POST',
			body: formData
		});
		
		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}
		
		const internalFilename = response.headers.get('X-Internal-Filename');
		const highlightedPdfBlob = await response.blob();
		const highlightedPdfUrl = URL.createObjectURL(highlightedPdfBlob);
		await renderPDF(highlightedPdfUrl, highlightedPdfContainer);
		
		if (internalFilename) {
			const csvResponse = await fetch(`${API_URL}/get_highlights_csv/${internalFilename}`);
			if (csvResponse.ok) {
				const csvText = await csvResponse.text();
				parseHighlightPositions(csvText);
				statusDiv.textContent = 'PDF processed successfully. Highlight positions loaded.';
			} else {
				statusDiv.textContent = 'PDF processed successfully, but could not load highlight positions.';
			}
		} else {
			statusDiv.textContent = 'PDF processed successfully, but internal filename was not provided.';
		}
		statusDiv.style.display = 'block';

	} catch (error) {
		console.error('Error processing PDF:', error);
		statusDiv.textContent = `Error: ${error.message}`;
		statusDiv.style.display = 'block';
	} finally {
		loadingDiv.style.display = 'none';
	}
}


function parseHighlightPositions(csvText) {
	const lines = csvText.trim().split('\n');
	const headers = lines[0].split(',');
	highlightPositions = [];
	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(',');
		const position = {};
		headers.forEach((header, index) => {
			position[header.trim()] = values[index].trim();
		});
		highlightPositions.push(position);
	}
	console.log('Highlight positions loaded:', highlightPositions);
}

pdfFileInput.addEventListener('change', async (e) => {
	const file = e.target.files[0];
	if (file && file.type === 'application/pdf') {
		currentPdfFile = file;
		updateProcessButton();
		const url = URL.createObjectURL(file);
		await renderPDF(url, originalPdfContainer);
		highlightedPdfContainer.innerHTML = '<p>Upload and process the PDF to see highlights</p>';
	}
});

processBtn.addEventListener('click', processPDF);

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