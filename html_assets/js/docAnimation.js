var viewerOpened = false;

const docSketch = function(s) {
	const numRows = 5;
	const boxColor = [65, 168, 211]

	let rows = [];

	const textItems = [
		"Morocco Water Security and Resilience Program",
		"Indonesia Universal Health Coverage Development",
		"Uttarakhand Climate Responsive Rainfed Farming Project",
		"Irrigation for Climate Resilient Agriculture",
		"Indonesia Universal Health Coverage Development Policy Loan"
	];

	let fontSize;
	let padding;
	const margin = 20;

	let pdfViewer;

	const animatePage = document.getElementById("document-page");
	var isEnabled = false;

	s.setup = function() {
		
		s.createCanvas(window.innerWidth, window.innerHeight);
		fontSize = 0.02 * window.innerHeight;
		padding = (0.037037 - 0.02) / 2 * window.innerHeight;

		s.textFont('monospace');
		s.textSize(fontSize);
		s.textAlign(s.CENTER, s.CENTER);

		pdfViewer = document.getElementById('pdf-container');
		navBar = document.getElementById('nav');

		const rowHeight = 0.037037 * window.innerHeight;
		const margin = (window.innerHeight - rowHeight * (2 * numRows + 1)) / 2;

		for (let i = 0; i < numRows; i++) {
			const direction = s.random() > 0.5 ? 1 : -1;
			const speed = s.random(0.6, 2.4);
			const y = margin + 2 * i * rowHeight + rowHeight / 2;
			const gap = s.random(50, 150);
			rows.push({
				direction,
				speed,
				y,
				gap,
				boxes: []
			});
			
			populateRow(i);
		}
	}

	s.draw = function() {
		isEnabled = animatePage.style.display == "block";
		if (isEnabled) {
			s.clear();
			for (let i = 0; i < rows.length; i++) {
				if (!currentHover && !viewerOpened	) {
					updateRow(i);
				}
				drawRow(i);
			}
		}
	}

	function populateRow(rowIndex) {
		const row = rows[rowIndex];

		let x = row.direction > 0 ? s.width : 0;

		let totalWidth = 0;

		while (totalWidth < s.width + 1000) {
			const text = s.random(textItems);
			const boxWidth = s.textWidth(text) + padding * 2;
			const boxHeight = fontSize + padding * 2;
			
			if (row.direction > 0) {
				x -= boxWidth;
			}
			
			const box = {
				text,
				x,
				width: boxWidth,
				height: boxHeight,
				color: boxColor
			};
			
			row.boxes.push(box);
			
			if (row.direction < 0) {
				x += boxWidth;
			}
			x += (row.direction > 0 ? -1 : 1) * row.gap;
			totalWidth += boxWidth + row.gap;

		}
		
	}

	function updateRow(rowIndex) {
		const row = rows[rowIndex];

		for (let box of row.boxes) {
			box.x += row.direction * row.speed;
		}

		if (row.direction > 0) {
			while (row.boxes.length > 0 && row.boxes[0].x > s.width) {
				row.boxes.shift();
				const text = s.random(textItems);
				
				const boxWidth = s.textWidth(text) + padding * 2;
				const boxHeight = fontSize + padding * 2;
				const lastBox = row.boxes[row.boxes.length - 1];
				const newX = lastBox.x - (boxWidth + row.gap) * row.direction;
				
				const box = {
					text,
					x: newX,
					width: boxWidth,
					height: boxHeight,
					color: boxColor
				};
				
				row.boxes.push(box);
			}
		} else {
			while (row.boxes.length > 0 && row.boxes[0].x + row.boxes[0].width < 0) {
				row.boxes.shift();
				const text = s.random(textItems);
		
				const boxWidth = s.textWidth(text) + padding * 2;
				const boxHeight = fontSize + padding * 2;
				const lastBox = row.boxes[row.boxes.length - 1];
				const newX = lastBox.x - (lastBox.width + row.gap) * row.direction;
				
				const box = {
					text,
					x: newX,
					width: boxWidth,
					height: boxHeight,
					color: boxColor
				};
				
				row.boxes.push(box);
			}
		}
	}

	function drawRow(rowIndex) {
		const row = rows[rowIndex];
		for (let box of row.boxes) {
			if (currentHover == box) {
				s.strokeWeight(5);
				s.stroke(box.color);
				s.fill(255);
				s.rect(box.x + 2, row.y - box.height / 2 + 2, box.width - 4, box.height - 4);
				s.noStroke();
				s.fill(box.color);
				s.text(box.text, box.x + box.width / 2, row.y);
			}
			else {
				s.noStroke();
				s.fill(box.color);
				s.rect(box.x, row.y - box.height / 2, box.width, box.height);
				s.fill(255);
				s.text(box.text, box.x + box.width / 2, row.y);
			}
		}
	}

	let currentHover = null;

	s.mouseMoved = function() {
		if (!isEnabled) {
			return;
		}
		if (viewerOpened) {
			currentHover = null;
			document.body.style.cursor = 'default';
			return;
		}
		for (let row of rows) {
			for (let box of row.boxes) {
				if (
					s.mouseX > box.x && 
					s.mouseX < box.x + box.width && 
					s.mouseY > row.y - box.height / 2 && 
					s.mouseY < row.y + box.height / 2
				) {
					currentHover = box;
					document.body.style.cursor = 'pointer';
					return;
				}
			}
		}
		currentHover = null;
		document.body.style.cursor = 'default';
	}

	s.mousePressed = function() {
		if (!isEnabled) {
			return;
		}
		if (currentHover) {
			pdfViewer.style.display = 'block';
			nav.style.display = 'none';
			viewerOpened = true;
		}
	}

	s.windowResized = function() {
		resizeCanvas(window.innerWidth, window.innerHeight);
		
		fontSize = 0.02 * window.innerHeight;
		padding = (0.037037 - 0.02) / 2 * window.innerHeight;

		const rowHeight = 0.037037 * window.innerHeight;
		const margin = (window.innerHeight - rowHeight * (2 * numRows + 1)) / 2;

		for (let i = 0; i < rows.length; i++) {
			rows[i].y = margin + 2 * i * rowHeight + rowHeight / 2;
		}
	}
};

function closePDFViewer() {
	pdfViewer.style.display = 'none';
	nav.style.display = 'block';
	viewerOpened = false;
}

addEventListener("load", (event) => {
	new p5(docSketch, 'doc-canvas-container');
});