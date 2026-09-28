/* VDT Media animations. Edit or delete freely; the page works without this file. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  const $ = (s) => [...document.querySelectorAll(s)];
  root.classList.add('js');

  // Nameplate into letters, headline into words
  const logo = $('.logo')[0];
  if (logo) {
    const t = logo.textContent;
    logo.setAttribute('aria-label', t);
    logo.textContent = '';
    [...t].forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = c === ' ' ? '\u00a0' : c;
      logo.append(s);
    });
  }
  const h1 = $('h1')[0];
  if (h1) {
    const t = h1.textContent.trim();
    h1.setAttribute('aria-label', t);
    h1.textContent = '';
    t.split(/\s+/).forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = w;
      h1.append(s, ' ');
    });
  }

  // Ticker: duplicate the strip so it loops without a gap
  const track = $('.ticker .track')[0];
  if (track) track.innerHTML += track.innerHTML;

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  $('figure').forEach((f) => {
    f.style.setProperty('--n', [...f.parentElement.children].indexOf(f) % 4);
    io.observe(f);
  });
  $('h2, .intro, .contact-form, .page > p').forEach((el) => { el.classList.add('rv'); io.observe(el); });

  // Scroll progress line, parallax photos, drifting shapes
  const bar = document.createElement('div');
  bar.className = 'progress';
  document.body.prepend(bar);
  const imgs = $('.art img');
  let queued = false;
  const update = () => {
    queued = false;
    const y = scrollY, vh = innerHeight;
    bar.style.setProperty('--p', y / ((root.scrollHeight - vh) || 1));
    root.style.setProperty('--sy', y);
    imgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const max = r.height * 0.08;
      const off = ((r.top + r.height / 2) - vh / 2) / vh;
      img.style.setProperty('--py', Math.max(-max, Math.min(max, -off * max * 2)) + 'px');
    });
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();

  // 3D tilt on photos (mouse only)
  if (matchMedia('(pointer: fine)').matches) {
    $('figure').forEach((f) => {
      f.addEventListener('pointermove', (e) => {
        const r = f.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        f.style.setProperty('--ry', x * 14 + 'deg');
        f.style.setProperty('--rx', -y * 14 + 'deg');
        f.classList.add('tilt');
      });
      f.addEventListener('pointerleave', () => {
        f.style.setProperty('--rx', '0deg');
        f.style.setProperty('--ry', '0deg');
        f.classList.remove('tilt');
      });
    });
  }
})();
