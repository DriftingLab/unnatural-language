const titlePage = document.getElementById("title-page");
const apiPage = document.getElementById("api-page");
const aboutPage = document.getElementById("about-page");

function switchPage(name) {
	switch (name) {
		case "title-page":
			titlePage.style.display = "block";
			apiPage.style.display = "none";
			aboutPage.style.display = "none";
			break;
		case "api-page":
			titlePage.style.display = "none";
			apiPage.style.display = "block";
			aboutPage.style.display = "none";
			break;
		case "about-page":
			titlePage.style.display = "none";
			apiPage.style.display = "none";
			aboutPage.style.display = "block";
			break;
	}
}

window.onload = (event) => {
	switchPage("api-page");
};