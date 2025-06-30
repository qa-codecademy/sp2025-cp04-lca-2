function initTestimonialsSlider() {
  const section = document.querySelector('.lang-text.active .testimonial_section');
  if (!section) return; // ако не постои видлива testimonial секција

  const slides = Array.from(section.querySelectorAll('.testimonial_slide'));
  const btnPrev = section.querySelector('.testimonial_prev_btn');
  const btnNext = section.querySelector('.testimonial_next_btn');
  const dotsContainer = section.querySelector('#dots');

  let current = 0;
  const total = slides.length;
  let intervalId;
  const SWIPE_THRESHOLD = 50;
  let startX = 0;

  // Clear old dots
  dotsContainer.innerHTML = '';

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.dataset.index = i;
    dotsContainer.append(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function show(n) {
    slides.forEach((s, i) => {
      s.classList.toggle('testimonial_slide_active', i === n);
      dots[i].classList.toggle('testimonial_slide_active', i === n);
    });
  }

  function go(offset) {
    current = (current + offset + total) % total;
    show(current);
    resetAutoplay();
  }

  function startAuto() {
    intervalId = setInterval(() => go(1), 4000);
  }

  function resetAutoplay() {
    clearInterval(intervalId);
    startAuto();
  }

  // Event listeners
  dotsContainer.addEventListener('click', e => {
    if (!e.target.matches('.dot')) return;
    current = +e.target.dataset.index;
    show(current);
    resetAutoplay();
  });

  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));

  section.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });
  section.addEventListener('touchend', e => {
    const delta = startX - e.changedTouches[0].clientX;
    if (delta > SWIPE_THRESHOLD) go(1);
    else if (delta < -SWIPE_THRESHOLD) go(-1);
  });

  // init
  show(current);
  startAuto();
}

// Првично иницијализирање
document.addEventListener('DOMContentLoaded', initTestimonialsSlider);
