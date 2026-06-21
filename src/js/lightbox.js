export function initLightbox() {
  const galleries = document.querySelectorAll('[data-lightbox]');
  if (!galleries.length) return;

  galleries.forEach(gallery => {
    const items = gallery.querySelectorAll('[data-lightbox-item]');
    if (!items.length) return;

    let current = 0;
    let lightbox = null;
    let imgEl = null;
    let counterEl = null;

    function createLightbox() {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Image preview');
      lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close lightbox"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        <button class="lightbox-nav prev" aria-label="Previous image"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
        <button class="lightbox-nav next" aria-label="Next image"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>
        <span class="lightbox-counter"></span>
      `;
      document.body.appendChild(lightbox);
      imgEl = document.createElement('img');
      imgEl.className = 'lightbox-img';
      lightbox.insertBefore(imgEl, lightbox.querySelector('.lightbox-close'));
      counterEl = lightbox.querySelector('.lightbox-counter');

      // Close
      lightbox.querySelector('.lightbox-close').addEventListener('click', close);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

      // Nav
      lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', () => navigate(-1));
      lightbox.querySelector('.lightbox-nav.next').addEventListener('click', () => navigate(1));

      // Keyboard
      document.addEventListener('keydown', onKey);

      // Swipe
      let touchStartX = 0;
      lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
      lightbox.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? -1 : 1);
      });
    }

    function open(index) {
      current = index;
      if (!lightbox) createLightbox();
      updateImage();
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => lightbox.classList.add('active'));
    }

    function close() {
      if (lightbox) lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      current = (current + dir + items.length) % items.length;
      updateImage();
    }

    function updateImage() {
      const src = items[current].querySelector('img')?.src || items[current].dataset.src;
      imgEl.src = src;
      counterEl.textContent = `${current + 1} / ${items.length}`;
    }

    function onKey(e) {
      if (!lightbox || !lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    }

    items.forEach((item, i) => {
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', item.querySelector('img')?.alt || 'Open gallery image');
      item.addEventListener('click', () => open(i));
      item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
      item.style.cursor = 'pointer';
    });
  });
}
