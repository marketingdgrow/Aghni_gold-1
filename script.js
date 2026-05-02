/* ============================================================
   AGHNI GOLD — PREMIUM JAVASCRIPT
   Custom cursor, scroll reveals, counters, FAQ, slider, nav
   ============================================================ */

(function () {
  'use strict';

  /* ============================================
     CUSTOM CURSOR
  ============================================ */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor scale on interactables
    const interactables = document.querySelectorAll('a, button, .btn, .faq-question, .badge-item, .review-card, .why-item');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '14px';
        cursor.style.height = '14px';
        cursor.style.background = 'var(--gold-bright)';
        follower.style.width  = '50px';
        follower.style.height = '50px';
        follower.style.borderColor = 'var(--gold-bright)';
        follower.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '8px';
        cursor.style.height = '8px';
        cursor.style.background = 'var(--gold-warm)';
        follower.style.width  = '32px';
        follower.style.height = '32px';
        follower.style.borderColor = 'var(--gold-bright)';
        follower.style.opacity = '0.6';
      });
    });
  }

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

    // Close on outside click
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
     INTERSECTION OBSERVER — SCROLL REVEALS
  ============================================ */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ============================================
     COUNTER ANIMATION
  ============================================ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(ease(progress) * target);
      el.textContent = current;
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

      // Close all
      faqItems.forEach(other => {
        other.dataset.open = 'false';
        const otherAnswer = other.querySelector('.faq-answer');
        const otherToggle = other.querySelector('.faq-toggle i');
        if (otherAnswer) otherAnswer.style.maxHeight = '0px';
        if (otherToggle) {
          otherToggle.classList.remove('fa-minus');
          otherToggle.classList.add('fa-plus');
        }
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.dataset.open = 'true';
        answer.style.maxHeight = answer.scrollHeight + 'px';
        if (toggle) {
          toggle.classList.remove('fa-plus');
          toggle.classList.add('fa-minus');
        }
      }
    });

    // Init open states
    if (item.dataset.open === 'true') {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });

  /* ============================================
     REVIEWS SLIDER
  ============================================ */
  const track   = document.getElementById('reviewsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (track) {
    const cards = track.querySelectorAll('.review-card');
    let current = 0;

    function getPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function updateSlider() {
      const pv = getPerView();
      const maxIdx = Math.max(0, cards.length - pv);
      current = Math.min(current, maxIdx);

      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 20;
      const offset = current * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      if (prevBtn) {
        prevBtn.style.opacity = current === 0 ? '0.4' : '1';
        prevBtn.disabled = current === 0;
      }
      if (nextBtn) {
        nextBtn.style.opacity = current >= maxIdx ? '0.4' : '1';
        nextBtn.disabled = current >= maxIdx;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (current > 0) { current--; updateSlider(); }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const pv = getPerView();
        const maxIdx = cards.length - pv;
        if (current < maxIdx) { current++; updateSlider(); }
      });
    }

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) {
        const pv = getPerView();
        const maxIdx = cards.length - pv;
        if (dx > 0 && current < maxIdx) { current++; updateSlider(); }
        else if (dx < 0 && current > 0) { current--; updateSlider(); }
      }
    }, { passive: true });

    window.addEventListener('resize', updateSlider, { passive: true });
    updateSlider();
  }

  /* ============================================
     ACTIVE NAV HIGHLIGHT ON SCROLL
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
          if (a.getAttribute('href') === '#' + sec.id) {
            a.classList.add('active');
          }
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
      const originalText = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-check"></i> <span>Received! We\'ll call you shortly</span>';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        this.reset();
      }, 4000);
    });
  }

  /* ============================================
     PARALLAX SUBTLE EFFECT ON HERO CIRCLES
  ============================================ */
  const heroCircles = document.querySelectorAll('.hero-circle');
  if (heroCircles.length && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroCircles.forEach((circle, i) => {
        const factor = (i + 1) * 0.3;
        circle.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    }, { passive: true });
  }

  /* ============================================
     HOVER GLOW ON BADGE ITEMS
  ============================================ */
  document.querySelectorAll('.badge-item, .belief-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(240,192,64,0.08) 0%, var(--bg-card) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* ============================================
     STICKY CALL BAR ON MOBILE
  ============================================ */
  if (window.innerWidth <= 768) {
    const stickyBar = document.createElement('div');
    stickyBar.className = 'mobile-sticky-bar';
    stickyBar.innerHTML = `
      <a href="tel:+918000100933" class="sticky-call-btn">
        <i class="fas fa-phone-alt"></i>
        <span>Call Now: 8000 100 933</span>
      </a>
      <a href="#estimationForm" class="sticky-quote-btn">
        <i class="fas fa-star"></i>
        <span>Get Free Quote</span>
      </a>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .mobile-sticky-bar {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        z-index: 990;
        display: flex;
        background: var(--bg-card);
        border-top: 1px solid var(--border-mid);
        box-shadow: 0 -8px 30px rgba(180,130,10,0.15);
      }
      .sticky-call-btn,
      .sticky-quote-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 14px 10px;
        font-family: var(--font-body);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.3px;
        transition: all 0.2s;
      }
      .sticky-call-btn {
        background: var(--bg-warm);
        color: var(--text-mid);
        border-right: 1px solid var(--border-light);
      }
      .sticky-call-btn i { color: var(--gold-warm); }
      .sticky-quote-btn {
        background: var(--grad-gold);
        color: var(--text-dark);
      }
      .sticky-call-btn:active,
      .sticky-quote-btn:active { opacity: 0.85; }
      body { padding-bottom: 56px; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(stickyBar);
  }

  /* ============================================
     INIT COMPLETE LOG
  ============================================ */
  console.log('%cAghni Gold ✦ Premium JS Loaded', 'color: #DAA520; font-weight: bold; font-size: 14px;');

})();