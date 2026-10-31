/* Tema, digitação, entrada das seções e faixa deslizante. */
(function () {
  const root = document.documentElement;

  // Tema: segue o sistema até o visitante escolher; a escolha fica só neste navegador.
  const dark = () =>
    root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const next = dark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Movimento (digitação, entrada das seções, faixa deslizante). Desligado com "reduzir movimento".
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('motion');

    const typeEl = document.querySelector('[data-type]');
    if (typeEl) {
      const full = typeEl.textContent ?? '';
      typeEl.style.minHeight = typeEl.offsetHeight + 'px';
      typeEl.textContent = '';
      let i = 0;
      const timer = setInterval(() => {
        typeEl.textContent = full.slice(0, ++i);
        if (i >= full.length) clearInterval(timer);
      }, 32);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.querySelectorAll('[data-reveal]').forEach((r, i) => {
            r.style.transitionDelay = 250 + i * 120 + 'ms';
            r.classList.add('in');
          });
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll('section.sec').forEach((s) => io.observe(s));

    const tracks = [...document.querySelectorAll('[data-track]')];
    tracks.forEach((t) => (t.parentElement.style.overflowX = 'hidden'));
    const tick = () => {
      for (const t of tracks) {
        const half = t.scrollWidth / 2;
        if (!half) continue;
        const x = ((((innerHeight - t.getBoundingClientRect().top) * 0.6) % half) + half) % half;
        t.style.transform = `translateX(${-x}px)`;
      }
      requestAnimationFrame(tick);
    };
    tick();
  }
})();
