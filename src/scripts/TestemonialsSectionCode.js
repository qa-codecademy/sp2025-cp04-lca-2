(() => {
  const section = document.querySelector('.testimonial_section');
  const slides = Array.from(section.querySelectorAll('.testimonial_slide'));
  const btnPrev = section.querySelector('.testimonial_prev_btn');
  const btnNext = section.querySelector('.testimonial_next_btn');
  const dotsContainer = section.querySelector('#dots');

  let current = 0;
  const total = slides.length;
  let intervalId;
  const SWIPE_THRESHOLD = 50;
  let startX = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.dataset.index = i;
    dotsContainer.append(dot);
  });
  const dots = Array.from(dotsContainer.children);

  // Show slide N
  function show(n) {
    slides.forEach((s, i) => {
      s.classList.toggle('testimonial_slide_active', i === n);
      dots[i].classList.toggle('testimonial_slide_active', i === n);
    });
  }

  // Move
  function go(offset) {
    current = (current + offset + total) % total;
    show(current);
    resetAutoplay();
  }

  // Autoplay
  function startAuto() {
    intervalId = setInterval(() => go(1), 4000);
  }
  function resetAutoplay() {
    clearInterval(intervalId);
    startAuto();
  }

  // Dot clicks
  dotsContainer.addEventListener('click', e => {
    if (!e.target.matches('.dot')) return;
    current = +e.target.dataset.index;
    show(current);
    resetAutoplay();
  });

  // Arrow clicks
  btnPrev.addEventListener('click', () => go(-1));
  btnNext.addEventListener('click', () => go(1));

  // Swipe
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
})();