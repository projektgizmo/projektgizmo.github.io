const photoTrack = document.getElementById('photoTrack');
if (photoTrack) {
  const slides = [...photoTrack.children];
  const dotsWrap = document.getElementById('photoDots');
  let activeIndex = 0;
  const goToSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('photo-carousel__slide--active', i === activeIndex);
      slide.setAttribute('aria-hidden', i === activeIndex ? 'false' : 'true');
    });
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
  goToSlide(0);
}
