/* ============================================================
   MANPREET SINGH — PORTFOLIO  |  main.js
   Sections:
   1. Scroll Progress
   2. Custom Cursor
   3. Navbar (scroll + hamburger)
   4. Hero Name — Letter-by-letter animation
   5. Typewriter effect
   6. Hero Canvas — Particle constellation
   7. Projects Canvas — Nebula background
   8. Scroll Reveal (IntersectionObserver)
   9. Skill bar fill animation
  10. Chip cloud pop-in
  11. Counter animation
  12. Project card — 3D tilt + colour var
  13. Contact form — validation + mailto
  14. Active nav highlight on scroll
  15. DOMContentLoaded bootstrap
============================================================ */

'use strict';

/* ── 1. SCROLL PROGRESS BAR ── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

/* ── 2. CUSTOM CURSOR ── */
function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .proj-card, .chip, .social-btn, .letter').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
  });
}

/* ── 3. NAVBAR ── */
function initNavbar() {
  const nav       = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Hamburger toggle
  function openMenu()  { hamburger.classList.add('open'); mobileMenu.classList.add('open'); }
  function closeMenu() { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); }

  hamburger.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', closeMenu));
}

/* ── 4. HERO NAME — Letter animation ── */
function initHeroName() {
  const el = document.getElementById('heroName');
  if (!el) return;
  const name = 'Manpreet';
  el.innerHTML = name.split('').map((ch, i) =>
    `<span class="letter" style="animation-delay:${0.55 + i * 0.07}s">${ch}</span>`
  ).join('');
}

/* ── 5. TYPEWRITER ── */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const titles = [
    'AI/ML Engineer Intern',
    'Python · TensorFlow · FastAPI',
    'Computer Vision Developer',
    'LSTM Forecasting Engineer',
    'Scikit-learn · MediaPipe · Docker'
  ];
  let ti = 0, ci = 0, deleting = false;

  function tick() {
    const cur = titles[ti];
    if (!deleting) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; setTimeout(tick, 300); return; }
    }
    setTimeout(tick, deleting ? 32 : 68);
  }
  setTimeout(tick, 1500);
}

/* ── 6. HERO CANVAS — Particle constellation ── */
function initHeroCanvas() {
  const cv  = document.getElementById('heroCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  function resize() {
    cv.width  = cv.offsetWidth;
    cv.height = cv.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles
  const pts = Array.from({ length: 65 }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - .5) * .00025,
    vy: (Math.random() - .5) * .00025,
    r: Math.random() * 1.6 + .3,
    a: Math.random() * .45 + .15,
    p: Math.random() * Math.PI * 2,
    h: Math.random() * 50 + 250  // hue 250-300 (purple)
  }));

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    t += .008;

    pts.forEach(p => {
      p.x = (p.x + p.vx + 1) % 1;
      p.y = (p.y + p.vy + 1) % 1;
      p.p += .015;
      const px = p.x * cv.width, py = p.y * cv.height;
      const a  = p.a * (.65 + .35 * Math.sin(p.p));
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.h},70%,70%,${a})`;
      ctx.fill();
    });

    // Connect close particles
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const ax = pts[i].x * cv.width, ay = pts[i].y * cv.height;
        const bx = pts[j].x * cv.width, by = pts[j].y * cv.height;
        const d  = Math.hypot(ax - bx, ay - by);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
          ctx.strokeStyle = `rgba(139,92,246,${.06 * (1 - d / 120)})`;
          ctx.lineWidth = .5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── 7. PROJECTS CANVAS — Nebula dots ── */
function initProjCanvas() {
  const cv = document.getElementById('projCanvas');
  if (!cv) return;
  const sec = document.getElementById('projects');
  const ctx = cv.getContext('2d');

  function resize() {
    cv.width  = sec.offsetWidth;
    cv.height = sec.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pts = Array.from({ length: 80 }, () => ({
    x: Math.random() * 1200, y: Math.random() * 800,
    vx: (Math.random() - .5) * .35, vy: -(Math.random() * .4 + .12),
    r: Math.random() * 1.5 + .3, a: Math.random() * .4 + .1,
    p: Math.random() * Math.PI * 2,
    reset() { this.x = Math.random() * cv.width; this.y = cv.height + 8; }
  }));

  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.p += .016;
      if (p.y < -10) p.reset();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${p.a * (.6 + .4 * Math.sin(p.p))})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── 8. SCROLL REVEAL ── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── 9. SKILL BAR FILL ── */
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.getAttribute('data-w');
        e.target.style.width = w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-fill').forEach(el => obs.observe(el));
}

/* ── 10. CHIP CLOUD POP-IN ── */
function initChips() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const chips = e.target.querySelectorAll('.chip');
        chips.forEach((chip, i) => {
          setTimeout(() => {
            chip.style.transition = `opacity .45s cubic-bezier(.34,1.56,.64,1), transform .45s cubic-bezier(.34,1.56,.64,1)`;
            chip.classList.add('popped');
          }, i * 55);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.chip-cloud').forEach(el => obs.observe(el));
}

/* ── 11. COUNTER ANIMATION ── */
function animCounter(el, target, decimals = 0) {
  const dur   = 1600;
  const start = performance.now();
  el.classList.add('counting');
  const suffix = decimals > 0 ? '' : (target > 100 ? '' : '+');

  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const v = (1 - Math.pow(1 - p, 3)) * target;
    el.textContent = v.toFixed(decimals) + (p < 1 ? '' : suffix);
    if (p < 1) requestAnimationFrame(step);
    else el.classList.remove('counting');
  })(start);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.counter').forEach(el => {
          const raw = el.getAttribute('data-target'); const tgt = parseFloat(raw); animCounter(el, tgt, raw.includes('.') ? 2 : 0);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat-row').forEach(el => obs.observe(el));
}

/* ── 12. PROJECT CARD — 3D tilt + colour CSS var ── */
function initProjectCards() {
  document.querySelectorAll('.proj-card').forEach(card => {
    // Set colour var
    const clr = card.getAttribute('data-color');
    if (clr) card.style.setProperty('--card-clr', clr);

    // 3D tilt
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -7;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * 7;
      card.style.transition = 'transform .1s ease, box-shadow .3s, border-color .3s';
      card.style.transform  = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.015)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1), box-shadow .3s, border-color .3s';
      card.style.transform  = '';
    });

    // Click card body → open GitHub
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      const gh = card.querySelector('.pc-gh');
      if (gh) window.open(gh.href, '_blank');
    });
  });
}

/* ── 13. CONTACT FORM ── */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const statusEl  = document.getElementById('formStatus');
  if (!form) return;

  const fields = {
    cname:  { errId: 'err-name',  min: 2,  msg: 'Name must be at least 2 characters.' },
    cemail: { errId: 'err-email', email: true, msg: 'Please enter a valid email address.' },
    cmsg:   { errId: 'err-msg',   min: 10, msg: 'Message must be at least 10 characters.' }
  };

  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    const input = document.getElementById(id.replace('err-', 'c'));
    if (input) { input.style.borderColor = '#f87171'; input.style.boxShadow = '0 0 0 3px rgba(248,113,113,.18)'; }
  }
  function clearErr(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
    const input = document.getElementById(id.replace('err-', 'c'));
    if (input) { input.style.borderColor = ''; input.style.boxShadow = ''; }
  }

  function validate(fieldId, cfg) {
    const el  = document.getElementById(fieldId);
    if (!el) return true;
    const val = el.value.trim();
    if (!val) { showErr(cfg.errId, fieldId.replace('c','').charAt(0).toUpperCase() + fieldId.replace('c','').slice(1) + ' is required.'); return false; }
    if (cfg.min && val.length < cfg.min) { showErr(cfg.errId, cfg.msg); return false; }
    if (cfg.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showErr(cfg.errId, cfg.msg); return false; }
    clearErr(cfg.errId);
    return true;
  }

  // Live validation on blur
  Object.entries(fields).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validate(id, cfg));
    el.addEventListener('input', () => { if (el.style.borderColor) validate(id, cfg); });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let ok = true;
    Object.entries(fields).forEach(([id, cfg]) => { if (!validate(id, cfg)) ok = false; });
    if (!ok) return;

    const btn  = document.getElementById('submitBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sending…'; btn.disabled = true; btn.style.opacity = '.7';

    const name    = document.getElementById('cname').value.trim();
    const email   = document.getElementById('cemail').value.trim();
    const subject = document.getElementById('csubject').value.trim() || 'Portfolio Contact';
    const msg     = document.getElementById('cmsg').value.trim();

    // 1 second simulated delay then open mailto
    setTimeout(() => {
      const sub  = encodeURIComponent(`[Portfolio] ${subject}`);
      const body = encodeURIComponent(`Hi Manpreet,\n\nFrom: ${name} (${email})\n\n${msg}`);
      window.open(`mailto:mk8912345667@gmail.com?subject=${sub}&body=${body}`);

      statusEl.textContent = '✓ Your email client has opened. Thanks for reaching out!';
      statusEl.className   = 'form-status ok';
      form.reset();

      btn.innerHTML = '✓ Message Sent'; btn.style.background = 'linear-gradient(135deg,#059669,#34d399)'; btn.style.opacity = '1';

      setTimeout(() => {
        statusEl.textContent = ''; statusEl.className = 'form-status';
        btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; btn.style.opacity = '';
      }, 5000);
    }, 900);
  });
}

/* ── 14. ACTIVE NAV ON SCROLL ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) cur = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
  }, { passive: true });
}

/* ── 15. BOOTSTRAP ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCursor();
  initNavbar();
  initHeroName();
  initTypewriter();
  initHeroCanvas();
  initProjCanvas();
  initReveal();
  initSkillBars();
  initChips();
  initCounters();
  initProjectCards();
  initContactForm();
  initActiveNav();
});
