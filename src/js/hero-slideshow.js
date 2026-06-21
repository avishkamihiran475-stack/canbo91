export function initHeroSlideshow() {
  const slideshow = document.querySelector('[data-hero-slideshow]');
  if (!slideshow) return;

  const slides = Array.from(slideshow.querySelectorAll('.hero-slide'));
  if (slides.length <= 1) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let current = slides.findIndex(slide => slide.classList.contains('active'));
  if (current < 0) current = 0;

  window.setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
}
