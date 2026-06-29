// =================================================================
// CONSTRUALUM · JS Premium
// =================================================================

(function() {
  'use strict';

  // FOOTER YEAR
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // NAVBAR SCROLL + BACK TO TOP
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');
  function handleScroll() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    if (backTop) {
      if (window.scrollY > 600) backTop.classList.add('show');
      else backTop.classList.remove('show');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // MOBILE MENU
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.textContent = '☰';
    }));
  }

  // BACK TO TOP
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // PARALLAX
  const parallaxEls = document.querySelectorAll('.hero-bg, .page-hero-bg, .parallax-bg');
  let ticking = false;
  function updateParallax() {
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
        const speed = parseFloat(el.dataset.speed || '0.3');
        const offset = rect.top * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });

  // SCROLL REVEAL
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  // COUNTERS
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const v = target * easeOutCubic(p);
      el.textContent = Number.isInteger(target)
        ? Math.floor(v).toLocaleString('es-MX')
        : v.toFixed(1);
      if (p < 1) requestAnimationFrame(update);
      else {
        el.textContent = Number.isInteger(target)
          ? target.toLocaleString('es-MX')
          : target.toFixed(1);
      }
    }
    requestAnimationFrame(update);
  }
  const counters = document.querySelectorAll('[data-target]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObs.observe(el));

  // MAGNETIC BUTTONS
  document.querySelectorAll('.btn-primary, .btn-wa, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // LIGHTBOX
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIdx = 0;
  const galleryImages = [];

  if (galleryItems.length && lightbox) {
    galleryItems.forEach((item, idx) => {
      const img = item.querySelector('img');
      if (img) galleryImages.push(img.src);
      item.addEventListener('click', () => openLightbox(idx));
    });
  }
  function openLightbox(idx) {
    currentIdx = idx;
    lightboxImg.src = galleryImages[currentIdx];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navLightbox(dir) {
    currentIdx = (currentIdx + dir + galleryImages.length) % galleryImages.length;
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentIdx];
      lightboxImg.style.opacity = 1;
    }, 150);
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navLightbox(1));
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  // ACTIVE NAV
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // TOAST
  const toast = document.getElementById('toast');
  function showToast(msg, type = '') {
    if (!toast) return;
    toast.textContent = (type === 'success' ? '✓ ' : '') + msg;
    toast.className = 'toast show';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  window.showToast = showToast;

  console.log(
    '%c🏗️ ConstruAlum %c· Soluciones fuertes, estructuras fuertes',
    'color:#0a2540;font-weight:900;font-size:18px',
    'color:#1e6fb5;font-size:14px'
  );
})();

/* ===================== FORM HANDLER ===================== */
function submitContact(event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  if (!name || (!phone && !email)) {
    window.showToast('Por favor completa al menos nombre y contacto.', 'error');
    return false;
  }

  const waText = encodeURIComponent(
    `Hola CONSTRUALUM! 👋\n\n` +
    `Nombre: ${name}\n` +
    `Teléfono: ${phone}\n` +
    `Email: ${email}\n` +
    `Servicio: ${service}\n` +
    `Mensaje: ${message}\n\n` +
    `Quiero cotizar un proyecto.`
  );
  const waUrl = `https://wa.me/5214435971802?text=${waText}`;

  window.showToast('¡Solicitud enviada! Abriendo WhatsApp para confirmar.', 'success');
  setTimeout(() => {
    window.open(waUrl, '_blank');
    event.target.reset();
  }, 800);

  return false;
}
