/* ─── NAV ─── */
const nav     = document.getElementById('nav');
const burger  = document.getElementById('burger');
const drawer  = document.getElementById('drawer');
const navLinks = document.querySelectorAll('.nl');
const drawLinks = document.querySelectorAll('.dl');

burger.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  const [s1, s2, s3] = burger.querySelectorAll('span');
  s1.style.transform = open ? 'rotate(45deg) translate(5px,5px)' : 'none';
  s2.style.opacity   = open ? '0' : '1';
  s3.style.transform = open ? 'rotate(-45deg) translate(7px,-7px)' : 'none';
});

drawLinks.forEach(l => l.addEventListener('click', () => {
  drawer.classList.remove('open');
  burger.querySelectorAll('span').forEach(s => { s.style.transform='none'; s.style.opacity='1'; });
}));

/* nav shadow on scroll */
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,.3)' : 'none';
  backTop.classList.toggle('show', window.scrollY > 400);
});

/* active nav link */
const sections = document.querySelectorAll('section[id]');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => io.observe(s));

/* ─── SCROLL REVEAL ─── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.sr, .reveal').forEach(el => ro.observe(el));

/* ─── BACK TO TOP ─── */
const backTop = document.getElementById('back-top');
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── FOOTER YEAR ─── */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

/* ─── CONTACT FORM ─── */
const form    = document.getElementById('contact-form');
const sendBtn = document.getElementById('send-btn');
const btnText = document.getElementById('btn-text');
const note    = document.getElementById('form-note');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showNote('Please fill in all required fields.', 'red');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNote('Please enter a valid email address.', 'red');
      return;
    }

    sendBtn.disabled = true;
    btnText.textContent = 'Sending…';

    try {
      const response = await fetch("https://formsubmit.co/ajax/shirshantssr@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: form.subject ? form.subject.value.trim() : 'Portfolio Contact',
          message: message
        })
      });

      if (response.ok) {
        form.reset();
        showNote("✅ Message sent! I'll get back to you soon.", 'green');
      } else {
        showNote("❌ Something went wrong. Please try again.", 'red');
      }
    } catch (error) {
      showNote("❌ Network error. Please try again later.", 'red');
    }

    sendBtn.disabled = false;
    btnText.textContent = 'Send Message';
  });
}

function showNote(msg, color) {
  if (!note) return;
  note.textContent = msg;
  note.style.color = color === 'green' ? '#4ADE80' : '#F87171';
  note.style.fontSize = '.82rem';
  note.style.marginTop = '.7rem';
  note.style.display = 'block';
  setTimeout(() => { note.style.display = 'none'; }, 5000);
}
