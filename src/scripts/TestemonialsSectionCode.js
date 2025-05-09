let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');

// Create dots
slides.forEach((_, index) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  dot.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
    resetAutoplay();
  });
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    dots[i].classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
      dots[i].classList.add('active');
    }
  });
}

function changeSlide(n) {
  currentSlide += n;
  if (currentSlide >= slides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  showSlide(currentSlide);
  resetAutoplay();
}

function autoPlaySlides() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// interval 
let autoPlayInterval = setInterval(autoPlaySlides, 4000);

function resetAutoplay() {
  clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(autoPlaySlides, 4000);
}

showSlide(currentSlide);
