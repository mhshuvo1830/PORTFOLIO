// Shared navigation and progressive enhancement; permanent light/cream theme.
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
const topButton = document.querySelector('.back-top');
const progress = document.querySelector('#progress');
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  topButton.hidden = scrollY < 400;
}
let scheduled = false;
window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(() => { onScroll(); scheduled = false; }); } }, {passive:true});
window.addEventListener('resize', onScroll); onScroll();
topButton.addEventListener('click', () => window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
document.querySelector('#year').textContent = new Date().getFullYear();
// Reveal only off-screen sections. Content remains visible without JavaScript.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('waiting'); entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('waiting'); observer.observe(el); } });
}
// Project filtering uses a real category attribute and native hidden state.
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) { count++; card.classList.remove('waiting'); }
  });
  document.querySelector('#filter-status').textContent = `Showing ${count} project${count===1?'':'s'}`;
}));
// GitHub Pages is static: validate and prepare a draft, never claim delivery.
const form = document.querySelector('#contact-form');
if (form) {
  const status = document.querySelector('#form-status');
  const actions = document.querySelector('#draft-actions');
  const draft = document.querySelector('#draft');
  const emailLink = document.querySelector('#open-email');
  function invalidateDraft() { actions.hidden = true; status.textContent = ''; }
  form.addEventListener('input', event => { if (event.target !== draft) { event.target.classList.remove('invalid'); event.target.removeAttribute('aria-invalid'); invalidateDraft(); } });
  form.addEventListener('submit', event => {
    event.preventDefault(); actions.hidden = true;
    const name = form.elements.name, message = form.elements.message;
    name.setCustomValidity(name.value.trim() ? '' : 'Enter your name.');
    message.setCustomValidity(message.value.trim().length >= 10 ? '' : 'Enter at least 10 characters.');
    if (!form.checkValidity()) {
      const invalid = form.querySelector(':invalid:not(fieldset)');
      if (invalid) { invalid.classList.add('invalid'); invalid.setAttribute('aria-invalid','true'); invalid.focus(); invalid.reportValidity(); }
      status.dataset.error = 'true'; status.textContent = 'Please complete the required fields with valid information.'; return;
    }
    const data = new FormData(form);
    const subject = `${data.get('reason')} — ${data.get('topic')}`;
    const body = `Name: ${name.value.trim()}\nEmail: ${data.get('email')}\nReason: ${data.get('reason')}\nTopic: ${data.get('topic')}\n\n${message.value.trim()}`;
    draft.value = `To: mhshuvo2040@gmail.com\nSubject: ${subject}\n\n${body}`;
    emailLink.href = `mailto:mhshuvo2040@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.dataset.error = 'false'; status.textContent = 'Email draft ready. Open your email app or copy the draft and send it yourself. No message has been sent.';
    actions.hidden = false;
  });
  document.querySelector('#copy-draft').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(draft.value); status.textContent = 'Draft copied. Send it using your email app.'; }
    catch (error) { draft.focus(); draft.select(); status.textContent = 'Select and copy the highlighted draft manually.'; }
  });
}
