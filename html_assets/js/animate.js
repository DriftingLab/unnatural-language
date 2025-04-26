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

function setup() {
	
	const canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('canvas-container');
	fontSize = 0.02 * windowHeight;
	padding = (0.037037 - 0.02) / 2 * windowHeight;

	textFont('monospace');
	textSize(fontSize);
	noStroke();

	pdfViewer = document.getElementById('pdf-container');
	navBar = document.getElementById('nav');

	const rowHeight = 0.037037 * windowHeight;
	const margin = (windowHeight - rowHeight * (2 * numRows + 1)) / 2;

	for (let i = 0; i < numRows; i++) {
		const direction = random() > 0.5 ? 1 : -1;
		const speed = random(0.6, 2.4);
		const y = margin + 2 * i * rowHeight + rowHeight / 2;
		const gap = random(50, 150);
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

function draw() {
	clear();
	for (let i = 0; i < rows.length; i++) {
		updateRow(i);
		drawRow(i);
	}
}

function populateRow(rowIndex) {
	const row = rows[rowIndex];

	let x = row.direction > 0 ? width : 0;

	let totalWidth = 0;

	while (totalWidth < width + 1000) {
		const text = random(textItems);
		const boxWidth = textWidth(text) + padding * 2;
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
		while (row.boxes.length > 0 && row.boxes[0].x > width) {
			row.boxes.shift();
			const text = random(textItems);
			
			const boxWidth = textWidth(text) + padding * 2;
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
			const text = random(textItems);
	
			const boxWidth = textWidth(text) + padding * 2;
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
		fill(box.color);
		rect(box.x, row.y - box.height / 2, box.width, box.height);
		fill(255);
		textAlign(CENTER, CENTER);
		text(box.text, box.x + box.width / 2, row.y);
	}
}

let currentHover = null;
let viewerOpened = false;

function mouseMoved() {
	if (viewerOpened) {
		currentHover = null;
		document.body.style.cursor = 'default';
		return;
	}
	for (let row of rows) {
		for (let box of row.boxes) {
			if (
				mouseX > box.x && 
				mouseX < box.x + box.width && 
				mouseY > row.y - box.height / 2 && 
				mouseY < row.y + box.height / 2
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

function mousePressed() {
	if (currentHover) {
		pdfViewer.style.display = 'block';
		nav.style.display = 'none';
		viewerOpened = true;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	
	fontSize = 0.02 * windowHeight;
	padding = (0.037037 - 0.02) / 2 * windowHeight;

	const rowHeight = 0.037037 * windowHeight;
	const margin = (windowHeight - rowHeight * (2 * numRows + 1)) / 2;

	for (let i = 0; i < rows.length; i++) {
		rows[i].y = margin + 2 * i * rowHeight + rowHeight / 2;
	}
}

function closePDFViewer() {
	pdfViewer.style.display = 'none';
	nav.style.display = 'block';
	viewerOpened = false;
}