const photoTrack = document.getElementById('photoTrack');
if (photoTrack) {
  const slides = [...photoTrack.children];
  const dotsWrap = document.getElementById('photoDots');
  const viewport = photoTrack.closest('.photo-carousel__viewport');
  const autoplayToggle = document.getElementById('photoAutoplay');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let pointerStart = null;
  let autoplayTimer;
  let pausedByUser = false;
  const clearAutoplay = () => {
    window.clearTimeout(autoplayTimer);
  };
  const scheduleAutoplay = () => {
    clearAutoplay();
    if (pausedByUser || reducedMotion.matches || document.hidden || viewport.matches(':hover, :focus-within')) return;
    autoplayTimer = window.setTimeout(() => {
      goToSlide(activeIndex + 1);
      scheduleAutoplay();
    }, 5000);
  };
  const updateAutoplayToggle = () => {
    const shouldPause = !pausedByUser;
    autoplayToggle.classList.toggle('photo-carousel__toggle--paused', !shouldPause);
    autoplayToggle.setAttribute('aria-label', shouldPause ? autoplayToggle.dataset.labelPause : autoplayToggle.dataset.labelPlay);
  };
  const goToSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    photoTrack.style.transform = `translate3d(-${activeIndex * 100}%, 0, 0)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle('photo-carousel__slide--active', i === activeIndex);
      slide.setAttribute('aria-hidden', i === activeIndex ? 'false' : 'true');
      slide.inert = i !== activeIndex;
    });
    [...dotsWrap.children].forEach((dot, i) => {
      const active = i === activeIndex;
      dot.classList.toggle('photo-carousel__dot--active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    scheduleAutoplay();
  };
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `photo-carousel__dot${i === 0 ? ' photo-carousel__dot--active' : ''}`;
    dot.setAttribute('aria-label', `${document.documentElement.lang === 'en' ? 'Go to photo' : 'Przejdź do zdjęcia'} ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  document.getElementById('photoNext').addEventListener('click', () => goToSlide(activeIndex + 1));
  document.getElementById('photoPrev').addEventListener('click', () => goToSlide(activeIndex - 1));
  autoplayToggle.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    updateAutoplayToggle();
    scheduleAutoplay();
  });
  viewport.addEventListener('mouseenter', clearAutoplay);
  viewport.addEventListener('mouseleave', scheduleAutoplay);
  viewport.addEventListener('focusin', clearAutoplay);
  viewport.addEventListener('focusout', () => {
    window.setTimeout(scheduleAutoplay, 0);
  });
  document.addEventListener('visibilitychange', scheduleAutoplay);
  reducedMotion.addEventListener('change', scheduleAutoplay);
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' || event.target.closest('button')) return;
    pointerStart = { x: event.clientX, y: event.clientY };
  });
  viewport.addEventListener('pointerup', (event) => {
    if (!pointerStart || event.target.closest('button')) {
      pointerStart = null;
      return;
    }
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    goToSlide(activeIndex + (deltaX < 0 ? 1 : -1));
  });
  viewport.addEventListener('pointercancel', () => {
    pointerStart = null;
  });
  viewport.addEventListener('keydown', (event) => {
    if (event.target.closest('button')) return;
    if (event.key === 'ArrowRight') goToSlide(activeIndex + 1);
    if (event.key === 'ArrowLeft') goToSlide(activeIndex - 1);
  });
  updateAutoplayToggle();
  goToSlide(0);
}
