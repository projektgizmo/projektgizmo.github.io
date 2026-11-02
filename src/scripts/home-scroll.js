const panels = document.querySelectorAll('.home-panel');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (panels.length > 0) {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    panels.forEach((panel) => panel.classList.add('home-panel--visible'));
  } else {
    document.documentElement.classList.add('home-scroll-ready');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('home-panel--visible', entry.isIntersecting);
      });
    }, { threshold: 0.35, rootMargin: '-8% 0px -8% 0px' });

    panels.forEach((panel) => observer.observe(panel));
  }
}
