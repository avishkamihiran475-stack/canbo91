const HOTEL_PHONE_INTERNATIONAL = '94777778744';
const HOTEL_EMAIL = 'canbohotel@gmail.com';
export function initFormValidation() { initContactForm(); initAvailabilityForm(); setMinimumDates(); updateCurrentYear(); initInquiryRoomToggle(); }

/* Show/hide room-type select based on inquiry type, and pre-fill from URL params */
function initInquiryRoomToggle() {
  const inquirySelect = document.getElementById('contact-inquiry');
  const roomTypeGroup = document.getElementById('contact-room-type-group');
  const roomTypeSelect = document.getElementById('contact-room-type');
  if (!inquirySelect || !roomTypeGroup) return;

  // Pre-fill from URL params (e.g. ?room=Deluxe%20Room)
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  if (roomParam) {
    inquirySelect.value = 'room';
    if (roomTypeSelect) {
      for (let opt of roomTypeSelect.options) {
        if (opt.value === roomParam) { roomTypeSelect.value = roomParam; break; }
      }
    }
    // Scroll to the inquiry form section
    setTimeout(() => {
      const contactForm = document.getElementById('contact-form');
      if (contactForm) contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }

  function toggle() {
    const isRoom = inquirySelect.value === 'room';
    roomTypeGroup.style.display = isRoom ? '' : 'none';
    if (roomTypeSelect) roomTypeSelect.required = isRoom;
  }
  inquirySelect.addEventListener('change', toggle);
  toggle(); // run on init
}

function initContactForm(){
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    clearValidation(form);
    const inquiryEl = form.querySelector('[name="inquiry"]');
    const isRoom = inquiryEl && inquiryEl.value === 'room';
    const fields = [
      {name:'name',minLength:2,message:'Please enter your full name (min 2 characters)'},
      {name:'email',type:'email',message:'Please enter a valid email address'},
      {name:'phone',minLength:10,message:'Please enter a valid phone number (min 10 digits)'},
      {name:'inquiry',message:'Please select an inquiry type'},
      {name:'message',minLength:10,message:'Please enter a message (min 10 characters)'}
    ];
    if (isRoom) fields.push({name:'room-type',message:'Please select a room type'});
    fields.forEach(f => {
      const input = form.querySelector(`[name="${f.name}"]`);
      if (!input) return;
      const v = input.value.trim();
      let valid = !!v;
      if (valid && f.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (valid && f.minLength) valid = v.length >= f.minLength;
      setFieldState(input, valid, f.message);
      if (!valid) ok = false;
    });
    if (!validateDateRange(form)) ok = false;
    if (!ok) { const first = form.querySelector('.error'); if (first) first.focus(); return; }
    showMessageOptions(form, buildContactMessage(form), 'Your inquiry is ready to send');
  });
  form.querySelectorAll('.form-input,.form-select,.form-textarea').forEach(input => input.addEventListener('input', () => {
    input.classList.remove('error','success');
    const error = input.closest('.form-group')?.querySelector('.form-error');
    if (error) error.remove();
  }));
}

function initAvailabilityForm(){
  const form = document.getElementById('availability-form');
  if (!form) return;
  const urlParams = new URLSearchParams(window.location.search);
  const roomParam = urlParams.get('room');
  if (roomParam) {
    const roomSelect = form.querySelector('[name="room"]');
    if (roomSelect) { for (let opt of roomSelect.options) { if (opt.value === roomParam) { roomSelect.value = roomParam; break; } } }
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    clearValidation(form);
    let ok = true;
    ['checkin','checkout','guests','room'].forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      const valid = !!input?.value;
      setFieldState(input, valid, 'This field is required');
      if (!valid) ok = false;
    });
    if (!validateDateRange(form)) ok = false;
    if (!ok) { const first = form.querySelector('.error'); if (first) first.focus(); return; }
    window.open(buildWhatsAppUrl(buildAvailabilityMessage(form)), '_blank', 'noopener,noreferrer');
  });
}

function validateDateRange(form){
  const checkin = form.querySelector('[name="checkin"]');
  const checkout = form.querySelector('[name="checkout"]');
  if (!checkin || !checkout || !checkin.value || !checkout.value) return true;
  if (new Date(checkout.value) <= new Date(checkin.value)) {
    checkout.classList.remove('success'); checkout.classList.add('error');
    showError(checkout,'Check-out date must be after check-in date');
    return false;
  }
  return true;
}

function setFieldState(input,valid,message){
  if (!input) return;
  input.classList.remove('error','success');
  if (!valid) { input.classList.add('error'); showError(input, message); } else input.classList.add('success');
}

function clearValidation(form){
  form.querySelectorAll('.form-error').forEach(el => el.remove());
  form.querySelectorAll('.error,.success').forEach(el => el.classList.remove('error','success'));
  form.parentNode.querySelectorAll('.form-success').forEach(el => el.remove());
}

function getFormValue(form,name,fallback='-'){return form.querySelector(`[name="${name}"]`)?.value?.trim()||fallback;}

function buildAvailabilityMessage(form){
  return [
    'Hello Hotel Canbo, I would like to check room availability.',
    `Check-in: ${getFormValue(form,'checkin')}`,
    `Check-out: ${getFormValue(form,'checkout')}`,
    `Guests: ${getFormValue(form,'guests')}`,
    `Room type: ${getFormValue(form,'room')}`
  ].join('\n');
}

function buildContactMessage(form){
  const inquiryEl = form.querySelector('[name="inquiry"]');
  const isRoom = inquiryEl && inquiryEl.value === 'room';
  const lines = [
    'Hello Hotel Canbo, I have an inquiry.',
    `Name: ${getFormValue(form,'name')}`,
    `Email: ${getFormValue(form,'email')}`,
    `Phone: ${getFormValue(form,'phone')}`,
    `Inquiry type: ${getFormValue(form,'inquiry')}`
  ];
  if (isRoom) lines.push(`Room type: ${getFormValue(form,'room-type')}`);
  lines.push(
    `Check-in: ${getFormValue(form,'checkin')}`,
    `Check-out: ${getFormValue(form,'checkout')}`,
    `Guests: ${getFormValue(form,'guests')}`,
    `Message: ${getFormValue(form,'message')}`
  );
  return lines.join('\n');
}

function buildWhatsAppUrl(message){return `https://wa.me/${HOTEL_PHONE_INTERNATIONAL}?text=${encodeURIComponent(message)}`;}
function buildEmailUrl(message){return `mailto:${HOTEL_EMAIL}?subject=${encodeURIComponent('Hotel Canbo Inquiry')}&body=${encodeURIComponent(message)}`;}

function showError(input,message){
  const parent = input.closest('.form-group') || input.parentNode;
  let error = parent.querySelector('.form-error');
  if (!error) { error = document.createElement('span'); error.className = 'form-error'; parent.appendChild(error); }
  error.textContent = message;
}

function showMessageOptions(form,message,title){
  const div = document.createElement('div');
  div.className = 'form-success';
  div.innerHTML = `
    <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <h3>${title}</h3>
    <p>Your message is ready. Tap <strong>Send via WhatsApp</strong> to open WhatsApp and send your inquiry directly to Hotel Canbo.</p>
    <div class="form-success-actions">
      <a class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener noreferrer" href="${buildWhatsAppUrl(message)}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Send via WhatsApp
      </a>
      <a class="btn btn-secondary" href="${buildEmailUrl(message)}">Send via Email</a>
      <button type="button" class="btn btn-text" id="reset-form">Edit Message</button>
    </div>`;
  form.style.display = 'none';
  form.parentNode.appendChild(div);
  div.querySelector('#reset-form')?.addEventListener('click', () => { div.remove(); form.style.display = ''; form.querySelector('input,select,textarea')?.focus(); });
}

function setMinimumDates(){
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"][name="checkin"],input[type="date"][name="checkout"]').forEach(input => { input.min = today; });
}

function updateCurrentYear(){document.querySelectorAll('#current-year').forEach(el => { el.textContent = String(new Date().getFullYear()); });}
