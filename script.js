/* ═══════════ ADYS AstroJourney — interactions ═══════════ */
(function () {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── sticky header ── */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── mobile drawer ── */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  function setDrawer(open) {
    drawer.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  hamburger.addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));
  backdrop.addEventListener('click', () => setDrawer(false));
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setDrawer(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setDrawer(false); });

  /* ── hero zodiac spokes ── */
  const spokes = document.getElementById('heroSpokes');
  if (spokes) {
    let d = '';
    for (let i = 0; i < 12; i++) {
      const a = (i * 30) * Math.PI / 180;
      d += `M${300 + 190 * Math.cos(a)} ${300 + 190 * Math.sin(a)}L${300 + 292 * Math.cos(a)} ${300 + 292 * Math.sin(a)}`;
    }
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    spokes.appendChild(p);
  }

  /* ── floating star particles ── */
  const canvas = document.getElementById('starCanvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let stars = [], W, H, raf;
    function resize() {
      W = canvas.width = canvas.offsetWidth * devicePixelRatio;
      H = canvas.height = canvas.offsetHeight * devicePixelRatio;
      const n = Math.min(80, Math.floor(canvas.offsetWidth / 12));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: (Math.random() * 1.3 + .4) * devicePixelRatio,
        vy: (Math.random() * .08 + .02) * devicePixelRatio,
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * .02 + .006,
        lime: Math.random() < .18
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        s.y -= s.vy; s.tw += s.ts;
        if (s.y < -4) s.y = H + 4;
        const a = .2 + .5 * (Math.sin(s.tw) * .5 + .5);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.lime ? `rgba(168,240,0,${a * .8})` : `rgba(210,160,255,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener('resize', resize);
    tick();
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) tick();
    }).observe(canvas);
  }

  /* ── scroll reveal ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => io.observe(el));

  /* ── category arrows ── */
  const catRow = document.getElementById('categoryRow');
  document.querySelector('.cat-prev')?.addEventListener('click', () => catRow.scrollBy({ left: -240, behavior: 'smooth' }));
  document.querySelector('.cat-next')?.addEventListener('click', () => catRow.scrollBy({ left: 240, behavior: 'smooth' }));

  /* ── wishlist toggle ── */
  document.querySelectorAll('.wish-btn').forEach(b => {
    b.addEventListener('click', () => {
      b.classList.toggle('active');
      const svg = b.querySelector('path');
      svg.setAttribute('fill', b.classList.contains('active') ? 'currentColor' : 'none');
    });
  });

  /* ── add to cart (demo) ── */
  const cartBadge = document.querySelector('.cart-badge');
  const cartBtnHeader = document.querySelector('.cart-icon-btn');
  let cartCount = 0;
  document.querySelectorAll('.btn-cart').forEach(b => {
    b.addEventListener('click', () => {
      cartCount++;
      cartBadge.textContent = cartCount;
      cartBtnHeader.setAttribute('aria-label', `Cart, ${cartCount} items`);
      const orig = b.textContent;
      b.textContent = '✓ Added!';
      b.disabled = true;
      setTimeout(() => { b.textContent = orig; b.disabled = false; }, 1400);
    });
  });

  /* ── newsletter (demo) ── */
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      const btn = nlForm.querySelector('button');
      if (input.value) {
        const orig = btn.textContent;
        btn.textContent = '✦ Subscribed!';
        input.value = '';
        setTimeout(() => (btn.textContent = orig), 2500);
      }
    });
  }
})();
