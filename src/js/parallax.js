import { throttle } from './utils.js';

export function initParallax() {
  if (window.innerWidth < 1024) return;

  const heroes = document.querySelectorAll('.hero-bg img');
  if (!heroes.length) return;

  window.addEventListener('scroll', throttle(() => {
    const scrollY = window.scrollY;
    heroes.forEach(img => {
      img.style.transform = `translateY(${scrollY * 0.3}px)`;
    });
  }, 30));
}
