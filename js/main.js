// Arbres Cordes & Cie — interactions UI

document.addEventListener('DOMContentLoaded', () => {

  /* sticky header background on scroll */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* mobile nav toggle */
  const burger = document.querySelector('.burger');
  const panel = document.querySelector('.mobile-panel');
  if (burger && panel) {
    const lockScroll = () => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    };
    const unlockScroll = () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
    const closePanel = () => {
      burger.classList.remove('is-open');
      panel.classList.remove('is-open');
      if (header) header.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
      unlockScroll();
    };
    burger.addEventListener('click', () => {
      const willOpen = !panel.classList.contains('is-open');
      burger.classList.toggle('is-open', willOpen);
      panel.classList.toggle('is-open', willOpen);
      if (header) header.classList.toggle('nav-open', willOpen);
      burger.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) lockScroll(); else unlockScroll();
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closePanel));
  }

  /* photo slider (carrousel) */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.photo-slider').forEach((slider) => {
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    if (slides.length < 2) return;
    let idx = 0;
    let timer = null;

    const show = (i) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, si) => s.classList.toggle('is-active', si === idx));
      dots.forEach((d, di) => d.classList.toggle('is-active', di === idx));
    };
    const startTimer = () => {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(() => show(idx + 1), 4200);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        show(i);
        startTimer();
      });
    });

    startTimer();
  });

  /* scroll-reveal */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 3, 2) * 90}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
});
