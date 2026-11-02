const photoTrack = document.getElementById('photoTrack');
if (photoTrack) {
  const slides = [...photoTrack.children];
  const dotsWrap = document.getElementById('photoDots');
  let activeIndex = 0;
  const goToSlide = (index) => {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    photoTrack.scrollTo({ left: slides[activeIndex].offsetLeft, behavior: 'smooth' });
    [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle('photo-carousel__dot--active', i === activeIndex));
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
}
