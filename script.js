/* ============================================================
   AGHNI GOLD — PREMIUM JAVASCRIPT v2.0
   No custom cursor | Enhanced reveals | Particles | FAQ | Slider
   ============================================================ */

(function () {
  'use strict';

  /* ============================================
     FLOATING GOLD PARTICLES
  ============================================ */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = window.innerWidth > 768 ? 18 : 8;
    const colors = ['#DAA520', '#F0C040', '#C9951A', '#FFF0A0', '#B8860B'];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 12 + 10;
      const color = colors[Math.floor(Math.random() * colors.length)];

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background: ${color};
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: 0;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  /* ============================================
     MOBILE NAV TOGGLE
  ============================================ */
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.classList.toggle('active');
      document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.main-nav a').forEach(a => {
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
        mainNav.classList.remove('open');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================
     STICKY HEADER
  ============================================ */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ============================================
     SCROLL TO TOP
  ============================================ */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     SMOOTH SCROLL
  ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     SCROLL REVEALS — INTERSECTION OBSERVER
  ============================================ */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ============================================
     COUNTER ANIMATION
  ============================================ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(ease(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        statNums.forEach(el => animateCounter(el));
        statsObserver.unobserve(statsBar);
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsBar);
  }

  /* ============================================
     FAQ ACCORDION
  ============================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    const toggle   = item.querySelector('.faq-toggle i');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.dataset.open === 'true';
      faqItems.forEach(other => {
        other.dataset.open = 'false';
        const otherAnswer = other.querySelector('.faq-answer');
        const otherToggle = other.querySelector('.faq-toggle i');
        if (otherAnswer) otherAnswer.style.maxHeight = '0px';
        if (otherToggle) { otherToggle.classList.remove('fa-minus'); otherToggle.classList.add('fa-plus'); }
      });
      if (!isOpen) {
        item.dataset.open = 'true';
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (toggle) { toggle.classList.remove('fa-plus'); toggle.classList.add('fa-minus'); }
      }
    });
    if (item.dataset.open === 'true') {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });

  /* ============================================
   REVIEWS CAROUSEL v3 — WORKING
============================================ */
(function () {
  'use strict';

  const slider   = document.getElementById('reviewsSlider');
  const dotsWrap = document.getElementById('rDots');
  const prevBtn  = document.getElementById('rPrev');
  const nextBtn  = document.getElementById('rNext');
  if (!slider) return;

  const cards = Array.from(slider.querySelectorAll('.rcard'));
  let current = 0;
  let autoTimer = null;

  function getPerView() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function maxIdx() {
    return Math.max(0, cards.length - getPerView());
  }

  /* Animate cards into view */
  function revealCards() {
    const pv = getPerView();
    cards.forEach((c, i) => {
      c.classList.remove('rcard--visible');
      if (i >= current && i < current + pv) {
        setTimeout(() => c.classList.add('rcard--visible'), (i - current) * 80);
      }
    });
  }

  /* Build dot buttons */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = maxIdx() + 1;
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'rdot' + (i === current ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', () => { current = i; update(); });
      dotsWrap.appendChild(d);
    }
  }

  function syncDots() {
    dotsWrap.querySelectorAll('.rdot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function update() {
    current = Math.max(0, Math.min(current, maxIdx()));
    const cardW = cards[0].getBoundingClientRect().width;
    const gap   = 22;
    slider.style.transform = `translateX(-${current * (cardW + gap)}px)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIdx();
    prevBtn.style.opacity = current === 0 ? '0.32' : '1';
    nextBtn.style.opacity = current >= maxIdx() ? '0.32' : '1';
    syncDots();
    revealCards();
  }

  prevBtn.addEventListener('click', () => { if (current > 0) { current--; update(); } });
  nextBtn.addEventListener('click', () => { if (current < maxIdx()) { current++; update(); } });

  /* Touch swipe */
  let tx = 0;
  slider.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) {
      if (dx > 0 && current < maxIdx()) { current++; update(); }
      else if (dx < 0 && current > 0) { current--; update(); }
    }
  }, { passive: true });

  /* Auto-play */
  function startAuto() {
    autoTimer = setInterval(() => {
      current = current < maxIdx() ? current + 1 : 0;
      update();
    }, 5000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  /* Resize */
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { buildDots(); update(); }, 150);
  }, { passive: true });

  /* Init */
  buildDots();
  update();
  startAuto();
  setTimeout(revealCards, 300);
})();
  /* ============================================
     ACTIVE NAV ON SCROLL
  ============================================ */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.main-nav a');
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const h   = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + h) {
        navLinks.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + sec.id) a.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ============================================
     FORM SUBMIT
  ============================================ */
  const estForm = document.getElementById('estForm');
  if (estForm) {
    estForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> <span>Received! We\'ll call you shortly.</span>';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
        this.reset();
      }, 4500);
    });
  }

  /* ============================================
     PARALLAX HERO GLOWS ON MOUSE
  ============================================ */
  const heroGlows = document.querySelectorAll('.hero-glow');
  if (heroGlows.length && window.innerWidth > 768) {
    document.querySelector('.hero')?.addEventListener('mousemove', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
      heroGlows.forEach((g, i) => {
        const factor = (i + 1) * 0.4;
        g.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

  /* ============================================
     HOVER RADIAL GLOW ON CARDS
  ============================================ */
  document.querySelectorAll('.badge-item, .belief-card, .result-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(240,192,64,0.09) 0%, transparent 65%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.backgroundImage = '';
    });
  });

  /* ============================================
     TICKER PAUSE ON HOVER
  ============================================ */
  const tickerEl = document.querySelector('.ticker');
  const tickerWrap = document.querySelector('.ticker-wrap');
  if (tickerEl && tickerWrap) {
    tickerWrap.addEventListener('mouseenter', () => {
      tickerEl.style.animationPlayState = 'paused';
    });
    tickerWrap.addEventListener('mouseleave', () => {
      tickerEl.style.animationPlayState = 'running';
    });
  }

  /* ============================================
     WHY ITEM STAGGER ON ENTER
  ============================================ */
  const whyItems = document.querySelectorAll('.why-item');
  const whyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll
          ? [entry.target] : [];
        entry.target.style.animation = `slideInStagger 0.5s var(--ease-out) both`;
        whyObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  whyItems.forEach((item, i) => {
    item.style.animationDelay = `${i * 0.08}s`;
    whyObserver.observe(item);
  });

  /* ============================================
     MOBILE STICKY BAR
  ============================================ */
  if (window.innerWidth <= 768) {
    const stickyBar = document.createElement('div');
    stickyBar.className = 'mobile-sticky-bar';
    stickyBar.innerHTML = `
      <a href="tel:+918000100933" class="sticky-call-btn">
        <i class="fas fa-phone-alt"></i>
        <span>Call: 8000 100 933</span>
      </a>
      <a href="#estimationForm" class="sticky-quote-btn">
        <i class="fas fa-star"></i>
        <span>Free Quote</span>
      </a>
    `;
    const style = document.createElement('style');
    style.textContent = `
      .mobile-sticky-bar {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 990;
        display: flex; background: var(--bg-card);
        border-top: 1px solid var(--border-mid);
        box-shadow: 0 -8px 30px rgba(180,130,10,0.18);
      }
      .sticky-call-btn, .sticky-quote-btn {
        flex: 1; display: flex; align-items: center; justify-content: center;
        gap: 8px; padding: 15px 10px;
        font-family: var(--font-body); font-size: 13px; font-weight: 700;
        letter-spacing: 0.3px; transition: all 0.2s;
      }
      .sticky-call-btn { background: var(--bg-warm); color: var(--text-mid); border-right: 1px solid var(--border-light); }
      .sticky-call-btn i { color: var(--gold-warm); }
      .sticky-quote-btn { background: var(--grad-gold); color: var(--text-dark); }
      .sticky-call-btn:active, .sticky-quote-btn:active { opacity: 0.82; }
      body { padding-bottom: 58px; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(stickyBar);
  }

  /* ============================================
     INIT
  ============================================ */
  console.log('%cAghni Gold ✦ Premium v2.0 Loaded', 'color: #DAA520; font-weight: bold; font-size: 14px;');

})();

/* ============================================
   AGHNI GOLD — Reviews Section JS
   Replace the old carousel block in your
   existing script.js with this version
============================================ */

(function () {
  'use strict';

  /* ============================================
     REVIEWS CAROUSEL — updated with dots
  ============================================ */
  const track   = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('reviewsDots');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  let current = 0;

  /* How many cards to show based on viewport */
  function getPerView() {
    if (window.innerWidth <= 768)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - getPerView());
  }

  /* Build dots */
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => { current = i; updateSlider(); });
      dotsWrap.appendChild(dot);
    }
  }

  /* Sync dots highlight */
  function syncDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  /* Move the track */
  function updateSlider() {
    current = Math.max(0, Math.min(current, maxIndex()));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 20; /* matches CSS gap on .reviews-track */
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;

    if (prevBtn) {
      prevBtn.style.opacity = current === 0 ? '0.38' : '1';
      prevBtn.disabled = current === 0;
    }
    if (nextBtn) {
      nextBtn.style.opacity = current >= maxIndex() ? '0.38' : '1';
      nextBtn.disabled = current >= maxIndex();
    }

    syncDots();
  }

  /* Prev / next buttons */
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (current > 0) { current--; updateSlider(); }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (current < maxIndex()) { current++; updateSlider(); }
    });
  }

  /* Touch swipe */
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 48) {
      if (dx > 0 && current < maxIndex()) { current++; updateSlider(); }
      else if (dx < 0 && current > 0)    { current--; updateSlider(); }
    }
  }, { passive: true });

  /* Rebuild on resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      updateSlider();
    }, 120);
  }, { passive: true });

  /* Auto-play (optional — remove if not needed) */
  let autoPlay = setInterval(() => {
    if (current < maxIndex()) { current++; }
    else { current = 0; }
    updateSlider();
  }, 5000);

  /* Pause auto-play on hover */
  track.closest('.reviews-carousel')?.addEventListener('mouseenter', () => {
    clearInterval(autoPlay);
  });
  track.closest('.reviews-carousel')?.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      if (current < maxIndex()) { current++; }
      else { current = 0; }
      updateSlider();
    }, 5000);
  });

  /* Init */
  buildDots();
  updateSlider();

})();