let textBars = [];

const barColor = [65, 168, 211]

const barTexts = [
	"Morocco Water Security and Resilience Program",
	"Indonesia Universal Health Coverage Development",
	"Uttarakhand Climate Responsive Rainfed Farming Project",
	"Irrigation for Climate Resilient Agriculture",
	"Indonesia Universal Health Coverage Development Policy Loan"
];

const speed = [2, 1, 3, 5, 4];

let marginTop;
let barHeight;
let barGap;

function setup() {

	marginTop = 320 / 1080 * windowHeight;
	barHeight = 40 / 1080 * windowHeight;
	barGap = 48 / 1080 * windowHeight;

	const canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('canvas-container');
	
	for (let i = 0; i < barTexts.length; i++) {
		textBars.push({
			row: i,
			text: barTexts[i],
			pos: width
		});
	}
	
	textFont('monospace');
	textSize(barHeight * 3 / 4);
}

function draw() {
	clear();
	
	for (let bar of textBars) {
		let tWidth = textWidth(bar.text);
		
		fill(barColor);
		noStroke();
		rect(bar.pos - 10, bar.row * (barHeight + barGap) + marginTop, tWidth + 20, barHeight);
		
		fill(255);
		text(bar.text, bar.pos, bar.row * (barHeight + barGap) + marginTop + barHeight * 3 / 4);
		
		bar.pos -= speed[bar.row];
		
		if (bar.pos < -tWidth - 20) {
			bar.pos = width;
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}