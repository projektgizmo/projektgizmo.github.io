const panels = document.querySelectorAll('.home-panel');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (panels.length > 0) {
  if (reducedMotion || !('IntersectionObserver' in window)) {
    panels.forEach((panel) => panel.classList.add('home-panel--visible'));
  } else {
    document.documentElement.classList.add('home-scroll-ready');

    const updatePanelRotation = () => {
      const viewportCenter = window.innerHeight / 2;
      const viewportRadius = window.innerHeight * 0.85;

      panels.forEach((panel) => {
        const center = panel.offsetTop + panel.offsetHeight / 2 - window.scrollY;
        const distance = (center - viewportCenter) / viewportRadius;
        const progress = Math.max(-1, Math.min(1, distance));
        const depth = 90 - Math.abs(progress) * 190;
        const scale = 1 - Math.abs(progress) * 0.08;

        panel.style.setProperty('--home-panel-rotation', `${-progress * 30}deg`);
        panel.style.setProperty('--home-panel-depth', `${depth}px`);
        panel.style.setProperty('--home-panel-scale', scale);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('home-panel--visible', entry.isIntersecting);
      });
    }, { threshold: 0.35, rootMargin: '-8% 0px -8% 0px' });

    panels.forEach((panel) => observer.observe(panel));
    window.addEventListener('scroll', updatePanelRotation, { passive: true });
    window.addEventListener('resize', updatePanelRotation);
    updatePanelRotation();
  }
}
