const titleSketch = function(s) {
	const rowCounts = 27;
	const barColor = [65, 168, 211]
	var barHeight;

	let barRows = [];

	const testPage = document.getElementById("title-page");
	var isEnabled = false;

	s.setup = function() {
		
		s.createCanvas(window.innerWidth, window.innerHeight);

		s.noStroke();

		pdfViewer = document.getElementById('pdf-container');
		navBar = document.getElementById('nav');

		barHeight = 0.037037 * window.innerHeight;

		for (let i = 0; i < rowCounts; i++) {
			const direction = s.random() > 0.5 ? 1 : -1;
			const speed = s.random(0.4, 2);
			const y = 2 * i * barHeight + barHeight / 2;
			barRows.push({
				direction,
				speed,
				y,
				boxes: []
			});
			
			populateRow(i);
		}
	}

	s.draw = function() {
		isEnabled = testPage.style.display == "block";
		if (isEnabled) {
			s.clear();
			for (let i = 0; i < barRows.length; i++) {
				updateRow(i);
				drawRow(i);
			}
		}
	}

	function populateRow(rowIndex) {
		const row = barRows[rowIndex];

		let x = row.direction > 0 ? s.width : 0;

		let totalWidth = 0;

		while (totalWidth < s.width + 1000) {
			const boxWidth = s.random(100, 600);
			
			if (row.direction > 0) {
				x -= boxWidth;
			}
			
			const box = {
				x,
				width: boxWidth,
				height: barHeight,
				color: barColor
			};
			
			row.boxes.push(box);
			
			if (row.direction < 0) {
				x += boxWidth;
			}
			let gap = s.random(100, 600);
			x += (row.direction > 0 ? -1 : 1) * gap;
			totalWidth += boxWidth + gap;

		}
		
	}

	function updateRow(rowIndex) {
		const row = barRows[rowIndex];

		for (let box of row.boxes) {
			box.x += row.direction * row.speed;
		}

		if (row.direction > 0) {
			while (row.boxes.length > 0 && row.boxes[0].x > s.width) {
				row.boxes.shift();
				const boxWidth = s.random(50, 1000);
				const lastBox = row.boxes[row.boxes.length - 1];
				const newX = lastBox.x - (boxWidth + s.random(100, 600)) * row.direction;
				
				const box = {
					x: newX,
					width: boxWidth,
					height: barHeight,
					color: barColor
				};
				
				row.boxes.push(box);
			}
		} else {
			while (row.boxes.length > 0 && row.boxes[0].x + row.boxes[0].width < 0) {
				row.boxes.shift();
				const boxWidth = s.random(50, 1000);
				const lastBox = row.boxes[row.boxes.length - 1];
				const newX = lastBox.x - (lastBox.width + s.random(100, 600)) * row.direction;
				
				const box = {
					x: newX,
					width: boxWidth,
					height: barHeight,
					color: barColor
				};
				
				row.boxes.push(box);
			}
		}
	}

	function drawRow(rowIndex) {
		const row = barRows[rowIndex];
		for (let box of row.boxes) {
			s.fill(box.color);
			s.rect(box.x, row.y - box.height / 2, box.width, box.height);
		}
	}


	function windowResized() {
		s.resizeCanvas(window.innerWidth, window.innerHeight);

		barHeight = 0.037037 * window.innerHeight;

		for (let i = 0; i < barRows.length; i++) {
			barRows[i].y = 2 * i * rowHeight + rowHeight / 2;
		}
	}
};

addEventListener("load", (event) => {
	new p5(titleSketch, 'title-canvas-container');
});