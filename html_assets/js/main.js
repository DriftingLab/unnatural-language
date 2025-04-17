const titlePage = document.getElementById("title-page");
const documentPage = document.getElementById("document-page");
const apiPage = document.getElementById("api-page");
const aboutPage = document.getElementById("about-page");

function switchPage(name) {
	switch (name) {
		case "title-page":
			titlePage.style.display = "block";
			documentPage.style.display = "none";
			apiPage.style.display = "none";
			aboutPage.style.display = "none";
			break;
		case "document-page":
			titlePage.style.display = "none";
			documentPage.style.display = "block";
			apiPage.style.display = "none";
			aboutPage.style.display = "none";
			break;
		case "api-page":
			titlePage.style.display = "none";
			documentPage.style.display = "none";
			apiPage.style.display = "block";
			aboutPage.style.display = "none";
			break;
		case "about-page":
			titlePage.style.display = "none";
			documentPage.style.display = "none";
			apiPage.style.display = "none";
			aboutPage.style.display = "block";
			break;
	}
}

window.onload = async function() {
	switchPage("title-page");
	try {
		await renderPDF("/tests/indonesia.pdf", originalPdfContainer);
		await renderPDF("/results/indonesia.pdf", highlightedPdfContainer);
	} catch (error) {
		console.error("Error:", error);
	}
};
