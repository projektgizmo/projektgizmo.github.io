const heroPanel = document.querySelector('.home-panel--hero');
const heroAnimation = document.getElementById('heroAnimation');
const heroStageText = document.getElementById('heroStageText');
const heroSkip = document.getElementById('heroSkip');
const navigationReveal = document.querySelector('.intro-nav-trigger');
const navigation = document.getElementById('site-navigation');

if (heroPanel && heroAnimation && heroStageText && heroSkip && navigationReveal && navigation) {
  const hero = heroPanel.querySelector('.hero-lp');
  const animationBase = hero.dataset.animationBase;
  const stages = [
    ['home_anim_stage0.mp4', hero.dataset.stage1 ?? hero.getAttribute('data-stage-1')],
    ['home_anim_stage1.mp4', hero.dataset.stage2 ?? hero.getAttribute('data-stage-2')],
    ['home_anim_stage2.mp4', hero.dataset.stage3 ?? hero.getAttribute('data-stage-3')],
    ['home_anim_stage3.mp4', hero.dataset.stage4 ?? hero.getAttribute('data-stage-4')]
  ];
  let stage = 0;
  let introActive = true;
  const playbackRate = 2;

  const setPlaybackRate = () => {
    heroAnimation.playbackRate = playbackRate;
    heroAnimation.defaultPlaybackRate = playbackRate;
  };

  const revealNavigation = () => {
    document.documentElement.classList.remove('home-intro-active');
    document.documentElement.classList.add('home-nav-revealing');
    heroSkip.hidden = true;
    navigationReveal.setAttribute('aria-expanded', 'true');
    navigationReveal.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Navigation visible' : 'Nawigacja widoczna');
    window.setTimeout(() => {
      document.documentElement.classList.remove('home-nav-revealing');
    }, 550);
  };

  const loadStage = (index) => {
    stage = index;
    heroStageText.classList.remove('hero-stage__text--visible');
    window.setTimeout(() => {
      heroStageText.textContent = stages[index][1];
      heroStageText.classList.add('hero-stage__text--visible');
    }, 140);
    heroAnimation.src = `${animationBase}${stages[index][0]}`;
    setPlaybackRate();
    heroAnimation.load();
    heroAnimation.addEventListener('loadedmetadata', setPlaybackRate, { once: true });
    heroAnimation.play().then(setPlaybackRate).catch(() => {});
  };

  const finishIntro = () => {
    if (!introActive) return;
    introActive = false;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    revealNavigation();
    heroAnimation.pause();
    heroStageText.textContent = stages[stages.length - 1][1];
    heroStageText.classList.add('hero-stage__text--visible');
  };

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.classList.add('home-intro-active');
  heroAnimation.addEventListener('ended', () => {
    if (!introActive) return;
    if (stage < stages.length - 1) loadStage(stage + 1);
    else finishIntro();
  });
  heroAnimation.addEventListener('play', setPlaybackRate);
  heroAnimation.addEventListener('timeupdate', setPlaybackRate);
  heroAnimation.addEventListener('error', finishIntro);
  heroSkip.addEventListener('click', () => {
    finishIntro();
  });
  navigationReveal.addEventListener('click', revealNavigation);

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) revealNavigation();
  }, { threshold: 0.2 });
  observer.observe(heroPanel);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishIntro();
  } else {
    setPlaybackRate();
    heroAnimation.play().catch(() => {});
    loadStage(0);
  }
}
