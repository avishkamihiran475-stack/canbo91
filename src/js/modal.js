import { getCookie, setCookie } from './utils.js';

export function initModal() {
  const modal = document.getElementById('offer-modal');
  if (!modal) return;

  // Check cookie
  if (getCookie('offer_modal_seen')) return;

  // Show after 5 seconds
  setTimeout(() => {
    modal.classList.add('active');
    setCookie('offer_modal_seen', '1', 24);
  }, 5000);

  // Close
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}
