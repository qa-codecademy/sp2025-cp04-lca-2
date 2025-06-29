function setLanguage(lang) {
    // Сите текстови ги криеме
    document.querySelectorAll('.lang-text').forEach(function(el) {
      el.classList.remove('active');
    });

    // Го прикажуваме избраниот
    const selected = document.getElementById('lang-' + lang);
    if (selected) {
      selected.classList.add('active');
    }
  }