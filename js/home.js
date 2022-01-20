// moved js from Home.html to this file

const slides = document.querySelectorAll(".slide");
const btns = document.querySelectorAll(".btn");

let currentSlide = 0;

const manualNav = function (manual) {
	slides.forEach((slide) => {
		slide.classList.remove("active");

		btns.forEach((btn) => {
			btn.classList.remove("active");
		});
	});

	slides[manual].classList.add("active");
	btns[manual].classList.add("active");
	++currentSlide;
};

btns.forEach((btn, i) => {
	btn.addEventListener("click", () => {
		manualNav(i);
		currentSlide = i;
	});
});

setInterval(() => {
	manualNav((currentSlide + 1) % 3);
}, 3000);
