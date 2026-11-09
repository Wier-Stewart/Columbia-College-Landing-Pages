const header = document.querySelector('.logo-banner');

window.addEventListener('scroll', () => {
  // Adds 'scrolled' if scrollY > 0, removes it if scrollY === 0
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });