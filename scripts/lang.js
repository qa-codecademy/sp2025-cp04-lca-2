function setLanguage(lang) {
  // Сите текстови ги криеме
  document.querySelectorAll('.lang-text').forEach(function(el) {
    el.classList.remove('active');
  });

  // Го прикажуваме избраниот јазик
  const selected = document.getElementById('lang-' + lang);
  if (selected) {
    selected.classList.add('active');
  }

  // Повторно иницијализирање на testimonial слајдерот
  if (typeof initTestimonialsSlider === 'function') {
    initTestimonialsSlider();
  }

  // Повторно прикажување на проекти
  if (typeof renderProjects === 'function') {
    renderProjects();
  }

  // Повторно прикажување на јавни повици
  if (typeof renderCalls === 'function') {
    renderCalls();
  }
}
