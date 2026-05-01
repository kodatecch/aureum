/**
 * Circle Website — main.js
 * Scroll-reveal, navbar, slider, modal, counters, forms
 */
(function () {
  'use strict';

  /* ── Navbar: scroll state ────────────────────────────── */
  var navbar  = document.getElementById('navbar');
  var navHam  = document.getElementById('navHam');
  var navMob  = document.getElementById('navMobile');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function onScroll() {
    /* Scrolled style */
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* Active link highlight */
    var offset = navbar.offsetHeight + 40;
    sections.forEach(function (sec) {
      var top = sec.offsetTop - offset;
      var bot = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bot) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        var active = document.querySelector('.nav-link[href="#' + sec.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Hamburger ───────────────────────────────────────── */
  navHam && navHam.addEventListener('click', function () {
    this.classList.toggle('open');
    navMob.classList.toggle('open');
    this.setAttribute('aria-expanded', this.classList.contains('open'));
  });
  document.querySelectorAll('.nav-mobile .nav-link').forEach(function (l) {
    l.addEventListener('click', function () {
      navHam.classList.remove('open');
      navMob.classList.remove('open');
      navHam.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── Smooth scroll for anchor links ─────────────────── */
  document.querySelectorAll('a[href^="#"], button[data-href]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var href = el.getAttribute('href') || el.dataset.href;
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight : 0);
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Scroll-Reveal (IntersectionObserver) ────────────── */
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.sr').forEach(function (el) {
    revealObs.observe(el);
  });

  /* ── Parallax: translate bg on scroll ───────────────── */
  /* Native CSS background-attachment:fixed handles this on desktop.
     On mobile (which disables fixed), we fall back to JS transform. */
  var isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) {
    var parallaxSections = document.querySelectorAll('.hero, .courses, .faq');
    window.addEventListener('scroll', function () {
      var sy = window.scrollY;
      parallaxSections.forEach(function (sec) {
        var rect = sec.getBoundingClientRect();
        var offset = (rect.top + sy) * 0.3;
        sec.style.backgroundPositionY = offset + 'px';
      });
    }, { passive: true });
  }

  /* ── Modal ───────────────────────────────────────────── */
  var modalBg = document.getElementById('modalBg');

  function openModal() {
    modalBg.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalEmail') && document.getElementById('modalEmail').focus();
  }
  function closeModal() {
    modalBg.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal="open"]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });
  document.querySelectorAll('[data-modal="close"]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  modalBg && modalBg.addEventListener('click', function (e) {
    if (e.target === modalBg) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ── Toast ───────────────────────────────────────────── */
  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function () { t.classList.remove('show'); }, 3400);
  }

  /* ── Forms ───────────────────────────────────────────── */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]');
      if (!email || !email.value.includes('@')) {
        email && (email.style.borderColor = '#e07a5f');
        setTimeout(function () { email && (email.style.borderColor = ''); }, 1500);
        return;
      }
      closeModal();
      showToast('🎉 Great! Check your inbox soon.');
      form.reset();
    });
  });

  /* ── Staggered card reveal ───────────────────────────── */
  /* Cards inside a grid animate one-by-one */
  document.querySelectorAll('.courses-grid, .reviews-grid, .syllabus-list').forEach(function (grid) {
    var items = grid.querySelectorAll('.course-card, .review-col, .syl-item');
    items.forEach(function (item, i) {
      item.classList.add('sr');
      item.style.transitionDelay = (0.1 * i) + 's';
      revealObs.observe(item);
    });
  });

  /* ── Entrance animation already done via CSS for hero.
        Re-trigger if user navigates back (bfcache) ─────── */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      document.querySelectorAll('.sr').forEach(function (el) {
        el.classList.remove('visible');
        setTimeout(function () { revealObs.observe(el); }, 100);
      });
    }
  });

})();
