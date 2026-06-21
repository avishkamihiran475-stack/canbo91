// Import all JS modules
import { initLoader } from './loader.js';
import { initNavbar } from './navbar.js';
import { initScrollReveal } from './scroll-reveal.js';
import { initParallax } from './parallax.js';
import { initCounters } from './counter.js';
import { initSliders } from './slider.js';
import { initGalleryFilter } from './gallery-filter.js';
import { initLightbox } from './lightbox.js';
import { initModal } from './modal.js';
import { initFormValidation } from './form-validation.js';
import { initHeroSlideshow } from './hero-slideshow.js';

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initScrollReveal();
  initParallax();
  initCounters();
  initSliders();
  initGalleryFilter();
  initLightbox();
  initModal();
  initFormValidation();
  initHeroSlideshow();
});
